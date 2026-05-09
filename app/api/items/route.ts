import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();

  const item = await prisma.inventoryItem.create({
    data: {
      name: body.name,
      category: body.category,
      quantity: Number(body.quantity),
      location: body.location,
    },
  });

  return NextResponse.json(item);
}