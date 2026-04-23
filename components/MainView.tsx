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
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

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

  const [lastKnownVersion, setLastKnownVersion] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIntervalRef = useRef<number>(5000);
  const isCheckingRef = useRef<boolean>(false);
  const lastKnownVersionRef = useRef<string>("");
  const processedEventsRef = useRef<Set<number>>(new Set()); // Track eventos ya procesados

  // Sync ref with state
  useEffect(() => {
    lastKnownVersionRef.current = lastKnownVersion;
    console.log(
      `🔄 lastKnownVersionRef updated to: ${lastKnownVersion || "EMPTY"}`,
    );
  }, [lastKnownVersion]);

  // Función para verificar actualizaciones
  const checkForUpdates = async () => {
    if (isCheckingRef.current) {
      console.log("⏭️ Skip check - already checking");
      return;
    }

    isCheckingRef.current = true;

    const currentLastKnownVersion = lastKnownVersionRef.current;
    console.log(`🔍 Checking updates at ${new Date().toLocaleTimeString()}`);
    console.log(
      `📊 Current lastKnownVersion: ${currentLastKnownVersion || "EMPTY"}`,
    );

    try {
      // Obtener la última fecha de creación
      console.log("📡 Fetching /api/reservas/version");
      const versionResponse = await fetch(`/api/reservas/version`);
      const { lastCreatedAt } = await versionResponse.json();

      console.log(`📅 API lastCreatedAt: ${lastCreatedAt || "NULL"}`);

      if (!lastCreatedAt) {
        console.log("⚠️ No lastCreatedAt returned from API");
        scheduleNextCheck();
        return;
      }

      // Comparar timestamps
      const shouldFetchNewEvents =
        !currentLastKnownVersion || lastCreatedAt !== currentLastKnownVersion;

      console.log(`🔄 Should fetch new events: ${shouldFetchNewEvents}`);
      console.log(`   Current version: ${currentLastKnownVersion || "EMPTY"}`);
      console.log(`   Latest version: ${lastCreatedAt}`);

      let eventsData = null;

      if (shouldFetchNewEvents) {
        console.log("🟢 NEW DATA DETECTED - Fetching events...");

        // Fetch eventos desde la última fecha conocida
        const sinceParam = currentLastKnownVersion || "";
        console.log(`📥 Fetching events since: ${sinceParam || "BEGINNING"}`);

        const eventsResponse = await fetch(
          `/api/reservas?since=${encodeURIComponent(sinceParam)}`,
        );
        eventsData = await eventsResponse.json();

        console.log(`📦 API returned ${eventsData.events?.length || 0} events`);
        console.log(`📋 Raw events data:`, eventsData.events);

        if (eventsData.events && eventsData.events.length > 0) {
          // Filtrar eventos que ya hemos procesado
          const newEvents = eventsData.events.filter(
            (event: any) => !processedEventsRef.current.has(event.id),
          );

          console.log(`📋 Filtered to ${newEvents.length} truly new events`);
          console.log(
            `📋 Already processed events count: ${processedEventsRef.current.size}`,
          );

          if (newEvents.length > 0) {
            // Formatear eventos
            const formattedEvents = newEvents.map((event: any) => ({
              ...event,
              date: dayjs(event.date),
              endTime: dayjs(event.endTime),
              createdAt: dayjs(event.createdAt),
            }));

            console.log(
              `➕ Adding ${formattedEvents.length} events to display`,
            );

            // ACTUALIZAR TANTO LOS EVENTOS FILTRADOS COMO LOS NO FILTRADOS (functional update para evitar stale closure)
            setEvents((prev) => [...prev, ...formattedEvents]);
            setUnfilteredEvents((prev) => [...prev, ...formattedEvents]);

            // Registrar eventos procesados
            newEvents.forEach((event: any) => {
              processedEventsRef.current.add(event.id);
            });

            console.log(
              `✅ Total processed events now: ${processedEventsRef.current.size}`,
            );
          } else {
            console.log("🟡 No new unique events to add");
          }
        } else {
          console.log("🟡 No events returned from API");
        }

        // ACTUALIZAR lastKnownVersion
        setLastKnownVersion(lastCreatedAt);
        console.log(`✅ Updated lastKnownVersion to: ${lastCreatedAt}`);
      } else {
        console.log("🔵 No new data to fetch - same timestamp");
      }

      // Ajustar intervalo SIEMPRE (fuera del if de shouldFetchNewEvents)
      if (shouldFetchNewEvents && eventsData?.events?.length > 0) {
        currentIntervalRef.current = 5000;
        console.log("🔄 Reset interval to 5000ms due to new data");
      } else {
        currentIntervalRef.current = Math.min(
          currentIntervalRef.current + 2000,
          30000,
        );
        console.log(`📈 Increased interval to ${currentIntervalRef.current}ms`);
      }
    } catch (error) {
      console.error("❌ Error checking updates:", error);
    } finally {
      isCheckingRef.current = false;
      scheduleNextCheck();
    }
  };

  // Función para programar la próxima verificación
  const scheduleNextCheck = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    console.log(`⏰ Next check in ${currentIntervalRef.current}ms`);

    intervalRef.current = setTimeout(() => {
      checkForUpdates();
    }, currentIntervalRef.current);
  };

  // Effect principal
  useEffect(() => {
    console.log("🚀 Initializing polling system");

    // Carga inicial completa (sin filtro de fecha)
    const initialLoad = async () => {
      try {
        console.log("📥 Initial full load of all events");
        const response = await fetch(`/api/reservas`); // Sin parámetro 'since'
        const eventsData = await response.json();

        console.log(
          `📦 Initial load got ${eventsData.events?.length || 0} events`,
        );

        if (eventsData.events && eventsData.events.length > 0) {
          // Formatear todos los eventos
          const formattedEvents = eventsData.events.map((event: any) => ({
            ...event,
            date: dayjs(event.date),
            endTime: dayjs(event.endTime),
            createdAt: dayjs(event.createdAt),
          }));

          console.log(`➕ Setting initial ${formattedEvents.length} events`);
          setEvents(formattedEvents);
          setUnfilteredEvents(formattedEvents);

          // Registrar todos los eventos como procesados
          eventsData.events.forEach((event: any) => {
            processedEventsRef.current.add(event.id);
          });

          console.log(
            `✅ Initially processed ${processedEventsRef.current.size} events`,
          );
        }
      } catch (error) {
        console.error("❌ Error in initial load:", error);
      }
    };

    // Ejecutar carga inicial
    initialLoad().then(() => {
      // Setup filtros
      setRooms(filtersData.roomFilters);
      setCourses(filtersData.subjectFilters);
      setReservationTypes(filtersData.resTypeFilters);

      // Comenzar polling después de la carga inicial
      console.log("⏰ Starting polling after initial load");
      scheduleNextCheck();
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up polling system");
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  // Debug: Mostrar conteo de eventos
  useEffect(() => {
    console.log(`📊 Current events count: ${filteredEvents.length}`);
  }, [filteredEvents]);

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
