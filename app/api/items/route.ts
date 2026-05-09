import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();

    if (!body.name || !body.category || body.quantity === undefined || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name: String(body.name),
        category: String(body.category),
        quantity: Number(body.quantity),
        location: String(body.location),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}