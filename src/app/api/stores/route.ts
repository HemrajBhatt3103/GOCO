export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/stores - public list of all store admins with their metadata
export async function GET() {
  try {
    const stores = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        storeName: true,
        storeDesc: true,
        storeType: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            customers: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: stores });
  } catch (error) {
    console.error("[STORES GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
