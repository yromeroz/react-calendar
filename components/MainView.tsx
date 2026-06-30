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
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    isLoading,
    error,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();
  const { setRooms, setCourses, setReservationTypes } = useFiltersStore();

  useEffect(() => {
    if (error) {
      toast.error("Error de conexión", {
        description: error,
      });
    }
  }, [error]);

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
        {isLoading ? (
          <div className="flex h-[75vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-sm text-gray-500">Cargando eventos...</p>
            </div>
          </div>
        ) : (
          <>
            {selectedView === "month" && <MonthView />}
            {selectedView === "week" && <WeekView />}
            {selectedView === "day" && <DayView />}
          </>
        )}
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
