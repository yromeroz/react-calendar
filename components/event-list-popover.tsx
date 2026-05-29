'use client'

import React from 'react';
import dayjs from 'dayjs';
// import es from 'dayjs/locale/es'
import { 
  CalendarEventType, 
  useEventStore 
} from '@/lib/store';
import { adjustColor, getContrastColor } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { IoCloseSharp } from "react-icons/io5"

type EventListPopoverProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  isOpen: boolean;
  onClose: () => void;
};

export function EventListPopover({ 
  date, 
  view, 
  events, 
  isOpen, 
  onClose }: EventListPopoverProps) {
  const { openEventSummary } = useEventStore();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl pl-4 pr-2 py-4 max-w-72 w-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold">Reservas</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>
       {filteredEvents.map((event) => {
        const eventName = event.name !== "" ? event.name : "-";
        const eventColor = event.color !== "" ? event.color : "#98b8ff"; // Default to blue if not found
        const darker = adjustColor(eventColor, 120);
        const lighter = adjustColor(eventColor, 150);
        const eventTextColor = getContrastColor(darker);

        return (
          <div
            title="Click para ver detalles"
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
              onClose();
            }}
            className="w-[95%] cursor-pointer rounded-sm border-2 my-2 border-gray-400 focus:outline-none text-xs md:text-sm transition-colors"
            style={{
              "--event-color": darker,
              "--hover-color": lighter,
              "--border-color": eventColor,
              color: eventTextColor,
            } as React.CSSProperties}
          >
            <div className={`${lineClamp} bg-[var(--event-color)] hover:bg-[var(--hover-color)] border-2 border-transparent hover:border-[var(--border-color)]`}>
            { view === "day" ? (
              <p>{event.date.format("h:mmA")} <br/>{eventName}</p>
            ) : (
              <p><strong>{event.date.format("h:mmA")}</strong> {eventName}</p>
            )}
            </div>
          </div>
        );
       })}
      </div>
    </div>
  );
}
