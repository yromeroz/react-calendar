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
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useSWR from "swr";
// import FloatingButton from "./FloatingButton";

type Props = {
  // eventsData: CalendarEventType[];
  filtersData: { 
    roomFilters: RoomFilterType[]; 
    subjectFilters: SubjectFilterType[]; 
    resTypeFilters: ReservationFilterType[] 
  };
  reservasUrl: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export default function MainView({
  // eventsData,
  filtersData,
  reservasUrl,
}: Props ) {
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

  // const [reservas, setReservas] = useState<CalendarEventType[]>(eventsData);
  const [events1, setEvents1] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [lastKnownVersion, setLastKnownVersion] = useState<string | null>(null);
  
  useSWR(
    `/api/reservas${lastSync ? `?since=${lastSync}` : ""}`,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        if (data.events.length > 0) {
          setEvents1([...events1, ...data.events]);
        }
        setLastSync(data.serverTime);
      },
    }
  );  

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let intervalTime = 5000; // 5 segundos

    const checkUpdates = async () => {
      const res = await fetch(`/api/reservas/version`);
      const { lastCreatedAt }: { lastCreatedAt: string } = await res.json();

      if (lastCreatedAt && lastCreatedAt !== lastKnownVersion) {
        await fetchEvents(lastCreatedAt);
        // Si hay cambios, reseteamos el intervalo a 5 segundos para obtener los datos lo antes posible
        intervalTime = 5000;
      } else {
        intervalTime = Math.min(intervalTime + 2000, 30000); // Incrementa el intervalo hasta un máximo de 30 segundos
      }
    };

    const fetchEvents = async (since: string) => {
      const res = await fetch(`/api/reservas?since=${since}`);
      const data = await res.json();

      if (data.events.length > 0) {
        setEvents1([...events1, ...data.events]);
      }
      
      setLastKnownVersion(since);
    };

    // primera carga
    fetchEvents("");

    // polling inteligente
    interval = setInterval(checkUpdates, intervalTime);
    
    // const mappedEvents: CalendarEventType[] = eventsData.map((e) => ({
      //   id: e.id,
      //   date: dayjs(e.date),
      //   name: e.name,
      //   description: e.description,
      //   courseId: e.courseId,
      //   groupId: e.groupId,
      //   state: e.state,
      //   rooms: e.rooms,
      //   subject: e.subject,
      //   reservationType: e.reservationType,
      //   endTime: dayjs(e.endTime),
      //   authRequired: e.authRequired,
      //   createdAt: dayjs(e.createdAt),
      //   manager: e.manager,
      //   authorization: e.authorization,
      //   managerLogin: e.managerLogin,
      //   color: e.color
      // }));

    setEvents(filteredEvents);
    setUnfilteredEvents(filteredEvents);
    setRooms(filtersData.roomFilters);
    setCourses(filtersData.subjectFilters);
    setReservationTypes(filtersData.resTypeFilters);

    return () => clearInterval(interval);
  }, [
    // eventsData,
    setEvents,
    setUnfilteredEvents,
    filtersData,
    setRooms,
    setCourses,
    setReservationTypes,
    lastSync, 
    lastKnownVersion
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

      {/* <FloatingButton /> */}
    </div>
  );
}
