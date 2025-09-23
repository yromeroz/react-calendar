import dayjs from "dayjs";
// import es from "dayjs/locale/es";
import React from "react";
import { 
  useFiltersStore,
  CalendarEventType,
  // useEventStore, 
} from "@/lib/store";
import { adjustColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EventListPopover } from "./event-list-popover";
import { EventSummaryPopover } from "./event-summary-popover";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  // const { openEventSummary } = useEventStore();
  const { rooms, courses, reservationTypes } = useFiltersStore();
    // const { selectedEvent, setEvents } = useEventStore();
  const [showAll, setShowAll] = React.useState(false);
  const [modalEvents, setModalEvents] = React.useState<CalendarEventType[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEventType | null>(null);
  const [showSummary, setShowSummary] = React.useState(false);

  const handleOpenSummary = (event: CalendarEventType) => {
    setSelectedEvent(event);
    setShowSummary(true);
  };

  const handleShowAll = (events: CalendarEventType[]) => {
    setModalEvents(events);
    setShowAll(true);
  };  

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

  return (
    <>
      {visibleEvents.map((event) => {
        const roomNames = event.rooms
          .map((roomId) => {
            const room = rooms.find((room) => room.id === roomId);
            return room ? room.shortname : "-";
          })
          .join(", ");

        const course = courses.find((subject) => subject.id === event.subject);
        const courseName = course ? course.name : "-";

        const reservationType = reservationTypes.find((rType) => rType.id === event.reservationType);
        const eventColor = reservationType ? reservationType.color : "#98b8ff"; // Default to blue if not found
        const darker = adjustColor(eventColor, -40);
        const lighter = adjustColor(eventColor, 40);

        return (
          <div
            title="Click para ver detalles"
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenSummary(event);
            }}
            // className={`w-[95%] cursor-pointer rounded-sm border-2 border-gray-400 focus:outline-none p-1 text-xs md:text-sm text-black ${getViewClass(view, eventColor)}`}
            className="w-[95%] cursor-pointer rounded-sm border-2 border-gray-400 focus:outline-none text-xs md:text-sm text-black transition-colors"
            style={{
              "--event-color": eventColor,
              "--hover-color": lighter,
              "--border-color": darker,
            } as React.CSSProperties}
          >
            <div className={`${lineClamp} bg-[var(--event-color)] hover:bg-[var(--hover-color)] border-2 border-transparent hover:border-[var(--border-color)]`}>
            { view === "day" ? (
              <p>{event.date.add(3, "hour").format("h:mmA")} <br/>{courseName}</p>
            ) : (
              <p>{event.date.add(3, "hour").format("h:mmA")}/{roomNames}</p>
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
            handleShowAll(filteredEvents);
          }}
        >
          +{hiddenEventsCount} más
        </Button>  
      )}
      {/* Popover / Modal */}
      {showAll && (
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl p-4 overflow-y-auto z-50" >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold">Reservas</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setShowAll(false);
              }}
            >
              Cerrar
            </Button>
          </div>
          <EventListPopover 
            date={date} 
            view={view} 
            events={modalEvents}
            isOpen={showAll}
            onClose={() => setShowAll(false)}
          />
        </div>
      )}
      {showSummary && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-60">
          <EventSummaryPopover
            isOpen={showSummary}
            onClose={() => setShowSummary(false)}
            event={selectedEvent}
          />
        </div>
      )}
    </>
  );
}
