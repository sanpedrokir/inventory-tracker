import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
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