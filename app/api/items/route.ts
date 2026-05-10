import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all inventory items
export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/items error:", error);

    return NextResponse.json(
      {
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

// CREATE inventory item
export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("POST body:", body);

    const item = await prisma.inventoryItem.create({
      data: {
        name: String(body.name || ""),
        category: String(body.category || ""),
        quantity: Number(body.quantity || 0),
        location: String(body.location || ""),
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error("POST /api/items error:", error);

    return NextResponse.json(
      {
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}