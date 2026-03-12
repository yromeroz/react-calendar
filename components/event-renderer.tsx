import dayjs from "dayjs";
// import es from "dayjs/locale/es";
import React from "react";
import { 
  CalendarEventType,
  useEventStore,
  useDateStore,
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
  const { setDate } = useDateStore();

  const filteredEvents = events.filter((event: CalendarEventType) => {

    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }

  });

  const maxEventsToShow = view === "month" ? 3 : 2;
  const visibleEvents = filteredEvents.slice(0, maxEventsToShow);
  const hiddenEventsCount = Math.max(filteredEvents.length - maxEventsToShow, 0);
  // Use horizontal truncation for month/week, keep multi-line clamp for day.
  const textClass = view === "day" ? "line-clamp-2" : "truncate whitespace-nowrap";
  const innerBoxClass =
    view === "month"
      ? "px-1 py-0 h-5"
      : view === "week"
      ? "px-2 py-1 h-6 overflow-hidden auto-white-space: all-content"
      : "px-2 py-1"; 

  return (
    <div className={view === "week" || view === "day" ? "flex flex-col items-start gap-1 py-1" : ""}>
      {visibleEvents.map((event) => { 
        const eventName = event.name !== "" ? event.name : "-";
        const eventColor = event.color !== "" ? event.color : "#98b8ff"; // Default to blue if not found
        const darker = adjustColor(eventColor, 120);
        const lighter = adjustColor(eventColor, 150);
        const eventDuration: number = Math.abs(event.date.diff(event.endTime,'hour',true));
        const eventSize = (view !== "day" || eventDuration*100 <= 100) ? 95 : eventDuration*100;

        return (
          <div
            title={eventName}
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
            // apply inline-block + box-border in week view so events don't expand the cell width
            className={`cursor-pointer rounded-sm border-2 border-gray-400 focus:outline-none text-xs md:text-sm text-black transition-colors ${(view === "month" || view === "week") ? "inline-block box-border w-[150px] overflow-hidden auto-white-space: all-content" : "w-full"}`}
            style={{
              "--event-color": darker,
              "--hover-color": lighter,
              "--border-color": eventColor,
            } as React.CSSProperties}
          >
            <div
              className={`${textClass} ${innerBoxClass} bg-[var(--event-color)] hover:bg-[var(--hover-color)] border-2 border-transparent hover:border-[var(--border-color)] ${view === "week" ? "max-w-full overflow-hidden" : "w-full"}`}
            >
               {view === "month" ? (
                 // In month view show only truncated event name so cell height is preserved
                 <p className="truncate">{eventName}</p>
               ) : view === "day" ? (
                 <p><strong>{event.date.format("h:mmA")}</strong> <br/>{eventName}</p>
               ) : (
                 <p className="truncate"><strong>{event.date.format("h:mmA")}</strong> {eventName}</p>
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
            // Ensure the global selected date matches this cell before opening the list
            setDate(date);
            openEventList(filteredEvents);
          }}
        >
          +{hiddenEventsCount} más
        </Button>  
      )}
    </div>
  );
}
