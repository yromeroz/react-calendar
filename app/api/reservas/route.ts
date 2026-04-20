import { NextResponse } from "next/server";
import { getEventsData } from "@/lib/data";
import { stringify } from "querystring";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since"); // Optional timestamp for incremental updates
  // Pass 'since' to fetch only updated events
  const events = await getEventsData(since !== null ? stringify({ since }) : ""); 

  return NextResponse.json({
    events,
  });
}
