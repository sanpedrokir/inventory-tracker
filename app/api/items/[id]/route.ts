import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: any) {
  const { prisma } = await import("@/lib/prisma");

  const id = context.params.id;
  const body = await request.json();

  const item = await prisma.inventoryItem.update({
    where: { id: Number(id) },
    data: {
      quantity: Number(body.quantity),
    },
  });

  return NextResponse.json(item);
}