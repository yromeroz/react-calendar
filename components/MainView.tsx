"use client";

import {
  CalendarEventType,
  RoomFilterType,
  SubjectFilterType,
  ReservationFilterType,
  useDateStore,
  useEventStore,
  useViewStore,
  useFiltersStore,
} from "@/lib/store";
import MonthView from "./month-view";
import SideBar from "./sidebar/SideBar";
import WeekView from "./week-view";
import DayView from "./day-view";
import EventPopover from "./event-popover";
import { EventSummaryPopover } from "./event-summary-popover";
import { EventListPopover } from "./event-list-popover";
import { useReservasPolling } from "@/hooks/useReservasPolling";
import { useState, useEffect } from "react";

type Props = {
  filtersData: {
    roomFilters: RoomFilterType[];
    subjectFilters: SubjectFilterType[];
    resTypeFilters: ReservationFilterType[];
  };
  reservasUrl: string;
};

export default function MainView({ filtersData, reservasUrl }: Props) {
  const { selectedView } = useViewStore();

  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    isEventListOpen,
    closeEventList,
    events: filteredEvents,
    selectedEvent,
    setEvents,
    setUnfilteredEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();
  const { setRooms, setCourses, setReservationTypes } = useFiltersStore();

  const handleNewEvents = (newEvents: CalendarEventType[]) => {
    setEvents((prev) => [...prev, ...newEvents]);
    setUnfilteredEvents((prev) => [...prev, ...newEvents]);
  };

  const { setOnEventsLoaded } = useReservasPolling();
  setOnEventsLoaded(handleNewEvents);

  useEffect(() => {
    setRooms(filtersData.roomFilters);
    setCourses(filtersData.subjectFilters);
    setReservationTypes(filtersData.resTypeFilters);
  }, []);

  return (
    <div className="mx-3 flex bg-blue-50">
      <SideBar />
      <div className="flex-1 px-2 pb-2">
        {selectedView === "month" && <MonthView />}
        {selectedView === "week" && <WeekView />}
        {selectedView === "day" && <DayView />}
      </div>

      {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}

      {isEventSummaryOpen && selectedEvent && (
        <EventSummaryPopover
          isOpen={isEventSummaryOpen}
          onClose={closeEventSummary}
          event={selectedEvent}
          urlParam={reservasUrl}
        />
      )}

      {isEventListOpen && (
        <EventListPopover
          isOpen={isEventListOpen}
          onClose={closeEventList}
          date={userSelectedDate}
          view={selectedView as "month" | "week" | "day"}
          events={filteredEvents}
        />
      )}
    </div>
  );
}
