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
import { useEffect } from "react";
import dayjs from "dayjs";
import FloatingButton from "./FloatingButton";

export default function MainView({
  eventsData,
  filtersData,
}: {
  eventsData: CalendarEventType[];
  filtersData: { 
    rooms: RoomFilterType[]; 
    subjects: SubjectFilterType[]; 
    reservationTypes: ReservationFilterType[] 
  };
}) {
  const { selectedView } = useViewStore();

  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
    setUnfilteredEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();

  const { setRooms, setCourses, setReservationTypes } = useFiltersStore();

  useEffect(() => {
    const mappedEvents: CalendarEventType[] = eventsData.map((event) => ({
      id: event.id,
      date: dayjs(event.date),
      title: event.title,
      description: event.description,
      courseId: event.courseId,
      groupId: event.groupId,
      frequency: event.frequency,
      state: event.state,
      isReplicable: event.isReplicable,
      rooms: event.rooms,
      subject: event.subject,
      reservationType: event.reservationType,
      endTime: dayjs(event.endTime),
      authRequired: event.authRequired,
      createdAt: dayjs(event.createdAt),
      manager: event.manager,
      authorization: event.authorization,
      managerLogin: event.managerLogin,
    }));

    setEvents(mappedEvents);
    setUnfilteredEvents(mappedEvents);
    setRooms(filtersData.rooms);
    setCourses(filtersData.subjects);
    setReservationTypes(filtersData.reservationTypes);
  }, [
    eventsData,
    setEvents,
    setUnfilteredEvents,
    filtersData,
    setRooms,
    setCourses,
    setReservationTypes,
  ]);

  return (
    <div className="mx-3 flex bg-blue-50">
      {/* SideBar */}
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
        />
      )}

      <FloatingButton />
    </div>
  );
}
