import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: any) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const params = await context.params;
    const id = Number(params.id);

    const body = await request.json();
    const quantity = Number(body.quantity);

    if (!id || Number.isNaN(quantity)) {
      return NextResponse.json(
        { error: "Invalid item ID or quantity" },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error("PATCH /api/items/[id] error:", error);

    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}