import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const body = await request.json();
  const id = context.params.id;

  const item = await prisma.inventoryItem.update({
    where: { id: Number(id) },
    data: {
      quantity: Number(body.quantity),
    },
  });

  return NextResponse.json(item);
}