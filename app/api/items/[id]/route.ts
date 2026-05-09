import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();

  const item = await prisma.inventoryItem.update({
    where: { id: Number(id) },
    data: {
      quantity: Number(body.quantity),
    },
  });

  return NextResponse.json(item);
}