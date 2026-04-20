import { NextResponse } from "next/server";
import { getLastCreatedAt } from "@/lib/data";

export async function GET() {
  const lastCreatedAt = await getLastCreatedAt(); 

  return NextResponse.json({
    lastCreatedAt: lastCreatedAt,
  });
}