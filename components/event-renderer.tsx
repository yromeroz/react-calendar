import dayjs from "dayjs";
// import es from "dayjs/locale/es";
import React from "react";
import { 
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

  const filteredEvents = events.filter((event: CalendarEventType) => {

    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }

  });

  const maxEventsToShow = 3;
  const visibleEvents = filteredEvents.slice(0, maxEventsToShow);
  const hiddenEventsCount = filteredEvents.length - maxEventsToShow;
  const lineClamp = (view === "day") ? "line-clamp-2" : "line-clamp-1";
  const leftAlign = (view === "day") ? "flex items-start justify-start" : "";

  return (
    <div>
      {visibleEvents.map((event) => { 
        const eventName = event.name !== "" ? event.name : "-";
        const eventColor = event.color !== "" ? event.color : "#98b8ff"; // Default to blue if not found
        const darker = adjustColor(eventColor, 120);
        const lighter = adjustColor(eventColor, 150);
        const eventDuration: number = Math.abs(event.date.diff(event.endTime,'hour',true));
        const eventSize = (view !== "day" || eventDuration*100 <= 100) ? 95 : eventDuration*100;

        return (
          <div
            title="Click para ver detalles"
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
            className={`cursor-pointer rounded-sm border-2 border-gray-400 focus:outline-none text-xs md:text-sm text-black transition-colors`}
            style={{
              "--event-color": darker,
              "--hover-color": lighter,
              "--border-color": eventColor,
              width: `${eventSize}%`
            } as React.CSSProperties}
          >
            <div className={`${lineClamp} bg-[var(--event-color)] hover:bg-[var(--hover-color)] border-2 border-transparent hover:border-[var(--border-color)] ${leftAlign}`}>
            { view === "day" ? (
              <p><strong>{event.date.format("h:mmA")}</strong> <br/>{eventName}</p>
            ) : (
              <p><strong>{event.date.format("h:mmA")}</strong> {eventName}</p>
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
    </div>
  );
}
