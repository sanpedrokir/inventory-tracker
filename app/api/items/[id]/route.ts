import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const item = await prisma.inventoryItem.update({
    where: { id: Number(id) },
    data: {
      quantity: Number(body.quantity),
    },
  });

  return NextResponse.json(item);
}