import { NextResponse } from "next/server";
import { getEventsData } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since"); // Optional timestamp for incremental updates
  // Pass 'since' to fetch only updated events
  const events = await getEventsData(since || "");
  
  const serializedEvents = events.map((event) => ({
    ...event,
    date: event.date.format('YYYY-MM-DDTHH:mm:ss'),
    endTime: event.endTime.format('YYYY-MM-DDTHH:mm:ss'),
    createdAt: event.createdAt.format('YYYY-MM-DDTHH:mm:ss'),
  }));

  return NextResponse.json({
    events: serializedEvents,
  });
}
