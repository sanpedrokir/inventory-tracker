import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedRoles = ["Admin", "Manager", "Employee"];

export async function POST(request: Request, context: any) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const params = await context.params;
    const itemId = Number(params.id);

    const body = await request.json();
    const userId = Number(body.userId);

    if (!itemId || !userId) {
      return NextResponse.json(
        { error: "Missing itemId or userId" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.appUser.findUnique({
        where: { id: userId },
      });

      if (!user) throw new Error("User not found");

      if (!allowedRoles.includes(user.role)) {
        throw new Error("User role is not allowed to check out items");
      }

      const item = await tx.inventoryItem.findUnique({
        where: { id: itemId },
      });

      if (!item) throw new Error("Item not found");

      if (item.quantity <= 0) {
        throw new Error("Item is out of stock");
      }

      const updatedItem = await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          quantity: item.quantity - 1,
        },
      });

      const checkoutLog = await tx.checkoutLog.create({
        data: {
          itemId,
          userId,
          quantity: 1,
        },
      });

      return { updatedItem, checkoutLog };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}