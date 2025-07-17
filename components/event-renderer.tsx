import { CalendarEventType, useEventStore } from "@/lib/store";

import dayjs from "dayjs";
// import es from "dayjs/locale/es";
import React from "react";
import { 
  getRooms, 
  // getCourses, 
  // getReservationTypes 
} from "@/lib/data";


type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary } = useEventStore();

    const rooms = getRooms();
    // const courses = getCourses();
    // const reservationTypes = getReservationTypes();
    // const { selectedEvent, setEvents } = useEventStore();

  const filteredEvents = events.filter((event: CalendarEventType) => {

    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }
  });

  return (
    <>
      {filteredEvents.map((event) => {
        const room = rooms.find((room) => room.id === event.room);
        const roomName = room ? room.name : "-";

        return (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
            className="line-clamp-1 w-[95%] cursor-pointer rounded-sm bg-blue-300 p-1 text-sm text-black"
          >
            <p>{event.date.format("h:mmA")} | {roomName}</p>

          </div>
      );
      })}
    </>
  );
}
