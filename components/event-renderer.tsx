import { CalendarEventType, useEventStore } from "@/lib/store";

import dayjs from "dayjs";
// import es from "dayjs/locale/es";
import React from "react";
import { 
  getRooms, 
  getCourses, 
  // getReservationTypes 
} from "@/lib/data";


type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  // filters?: {
  //   room?: number;
  //   course?: number;
  //   reservationType?: number;
  // };
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary } = useEventStore();

    const rooms = getRooms();
    const courses = getCourses();
    // const reservationTypes = getReservationTypes();
    // const { selectedEvent, setEvents } = useEventStore();

  const filteredEvents = events.filter((event: CalendarEventType) => {

    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }

  });

  const getViewClass = (view: string, color: string) => {
    if (view === "day") {
      const res = `line-clamp-2 bg-${color}-300 hover:bg-${color}-100`;
      return res;
    } else {
      return "line-clamp-1 bg-blue-300 hover:bg-blue-100 hover:border-blue-500";
    }
  }

  return (
    <>
      {filteredEvents.map((event) => {
        const room = rooms.find((room) => room.id === event.room);
        const roomName = room ? room.name : "-";

        const course = courses.find((course) => course.id === event.course);
        const courseName = course ? course.name : "-";
        const courseColor = course ? course.color : "blue";

        return (
          <div
            title="Click para ver detalles"
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
            className={`w-[95%] cursor-pointer rounded-sm border-2 border-gray-400 focus:outline-none p-1 text-xs md:text-sm text-black ${getViewClass(view, courseColor)}`}
          >
            { view === "day" ? (
              <p>{event.date.format("h:mmA")} <br/>{courseName}</p>
            ) : (
              <p>{event.date.format("h:mmA")} {roomName}</p>
            )}

          </div>
      );
      })}
    </>
  );
}
