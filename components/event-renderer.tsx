import dayjs from "dayjs";
// import es from "dayjs/locale/es";
import React from "react";
import { 
  useFiltersStore,
  CalendarEventType,
  useEventStore, 
} from "@/lib/store";
import { adjustColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary, openEventList } = useEventStore();
  const { rooms } = useFiltersStore();  

  const filteredEvents = events.filter((event: CalendarEventType) => {

    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.add(3, "hour").format("DD-MM-YY HH") === date.add(3, "hour").format("DD-MM-YY HH");
    }

  });

  const maxEventsToShow = 3;
  const visibleEvents = filteredEvents.slice(0, maxEventsToShow);
  const hiddenEventsCount = filteredEvents.length - maxEventsToShow;
  const lineClamp = (view === "day") ? "line-clamp-2" : "line-clamp-1";  

  return (
    <>
      {visibleEvents.map((event) => {
        const roomNames = event.rooms
          // .filter(roomId => rooms.some(room => room.id === roomId))
          .map((roomId) => {
            const room = rooms.find((room) => room.id === roomId);
            return room ? room.shortname : "-";
          })
          .join(", "); 

        // const course = courses.find((subject) => subject.id === event.subject);
        // const courseName = course ? course.name : "-";
        const eventName = event.name ? event.name : "-";

        const eventColor = event.color ? event.color : "#98b8ff"; // Default to blue if not found
        const darker = adjustColor(eventColor, 120);
        const lighter = adjustColor(eventColor, 150);

        return (
          <div
            title="Click para ver detalles"
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
            className="w-[95%] cursor-pointer rounded-sm border-2 border-gray-400 focus:outline-none text-xs md:text-sm text-black transition-colors"
            style={{
              "--event-color": darker,
              "--hover-color": lighter,
              "--border-color": eventColor,
            } as React.CSSProperties}
          >
            <div className={`${lineClamp} bg-[var(--event-color)] hover:bg-[var(--hover-color)] border-2 border-transparent hover:border-[var(--border-color)]`}>
            { view === "day" ? (
              <p>{event.date.add(3, "hour").format("h:mmA")} <br/>{eventName}</p>
            ) : (
              <p><strong>{event.date.add(3, "hour").format("h:mmA")}</strong> {roomNames}</p>
            )}
            </div>
          </div>
        );
      })}
      {/* Botón +X más */}
      {hiddenEventsCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs md:text-sm text-blue-600 hover:text-blue-800"
          onClick={(e) => {
            e.stopPropagation();
            openEventList(filteredEvents);
          }}
        >
          +{hiddenEventsCount} más
        </Button>  
      )}
    </>
  );
}
