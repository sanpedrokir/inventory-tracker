import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { prisma } = await import("@/lib/prisma");

  const items = await prisma.InventoryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { prisma } = await import("@/lib/prisma");

  const body = await request.json();

 try{
  const item = await prisma.inventoryItem.create({
    data: {
      name: String(body.name),
      category: String(body.category),
      quantity: Number(body.quantity),
      location: String(body.location || ""),
   
    },
  });

  return NextResponse.json(item);

} catch (error) {
  console.error(error);

  return NextResponse.json(
    { error: String(error) },
    { status: 500 }
  );
}
}