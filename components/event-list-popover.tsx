'use client'

import React from 'react';
import dayjs from 'dayjs';
// import es from 'dayjs/locale/es'
import { CalendarEventType, useFiltersStore, useEventStore } from '@/lib/store';
import { adjustColor } from "@/lib/utils";

type EventListPopoverProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
};

export function EventListPopover({ 
  date, 
  view, 
  events, 
  isOpen, 
  onClose }: EventListPopoverProps & { isOpen: boolean; onClose: () => void}) {
  const { openEventSummary } = useEventStore();
  const { rooms, courses, reservationTypes } = useFiltersStore();    
  const lineClamp = (view === "day") ? "line-clamp-2" : "line-clamp-1";

  if (!isOpen) return null;

  const filteredEvents = events.filter((event: CalendarEventType) => {

    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }

  }); 


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-4 max-w-xs w-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold">Reservas</h3>
          <button
            className="text-xs px-2 py-1 rounded border hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            type="button"
          >
            Cerrar
          </button>
        </div>
       {filteredEvents.map((event) => {
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
              openEventSummary(event);
              onClose();
            }}
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
      </div>
    </div>
  );
}
