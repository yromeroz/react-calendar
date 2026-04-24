import { NextResponse } from "next/server";
import { getCarrerasData } from "@/lib/data";

export async function GET() {
  const carreras = await getCarrerasData(); 

  return NextResponse.json({
    carreras: carreras,
  });
}