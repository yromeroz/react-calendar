"use client";

import { useEffect, useRef, useCallback } from "react";
import { CalendarEventType } from "@/lib/store";
import dayjs from "dayjs";

type PollingOptions = {
  minInterval?: number;
  maxInterval?: number;
  intervalIncrement?: number;
  maxProcessedEvents?: number;
};

type UseReservasPollingReturn = {
  setOnEventsLoaded: (callback: (events: CalendarEventType[]) => void) => void;
  triggerLoad: () => Promise<void>;
};

export function useReservasPolling(
  options: PollingOptions = {},
): UseReservasPollingReturn {
  const minInterval = options.minInterval ?? 5000;
  const maxInterval = options.maxInterval ?? 30000;
  const intervalIncrement = options.intervalIncrement ?? 2000;
  const maxProcessedEvents = options.maxProcessedEvents ?? 1000;

  const onEventsLoadedRef = useRef<
    ((events: CalendarEventType[]) => void) | null
  >(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIntervalRef = useRef<number>(minInterval);
  const isCheckingRef = useRef<boolean>(false);
  const lastKnownVersionRef = useRef<string>("");
  const processedEventsRef = useRef<Set<number>>(new Set());
  const isInitializedRef = useRef<boolean>(false);

  const cleanOldEvents = useCallback(() => {
    if (processedEventsRef.current.size > maxProcessedEvents) {
      const eventsArray = Array.from(processedEventsRef.current);
      const toRemove = eventsArray.slice(
        0,
        eventsArray.length - maxProcessedEvents,
      );
      toRemove.forEach((id) => processedEventsRef.current.delete(id));
    }
  }, [maxProcessedEvents]);

  const setOnEventsLoaded = useCallback(
    (callback: (events: CalendarEventType[]) => void) => {
      onEventsLoadedRef.current = callback;
    },
    [],
  );

  const checkForUpdates = useCallback(async () => {
    if (isCheckingRef.current) return;

    isCheckingRef.current = true;

    try {
      const versionResponse = await fetch(`/api/reservas/version`);
      const { lastCreatedAt } = await versionResponse.json();

      if (!lastCreatedAt) {
        scheduleNextCheck();
        return;
      }

      const shouldFetchNewEvents =
        !lastKnownVersionRef.current ||
        lastCreatedAt !== lastKnownVersionRef.current;

      let eventsData = null;

      if (shouldFetchNewEvents) {
        const sinceParam = lastKnownVersionRef.current || "";

        const eventsResponse = await fetch(
          `/api/reservas?since=${encodeURIComponent(sinceParam)}`,
        );
        eventsData = await eventsResponse.json();

        if (eventsData.events && eventsData.events.length > 0) {
          const newEvents = eventsData.events.filter(
            (event: any) => !processedEventsRef.current.has(event.id),
          );

          if (newEvents.length > 0) {
            const formattedEvents = newEvents.map((event: any) => ({
              ...event,
              date: dayjs(event.date),
              endTime: dayjs(event.endTime),
              createdAt: dayjs(event.createdAt),
            }));

            onEventsLoadedRef.current?.(formattedEvents);

            newEvents.forEach((event: any) => {
              processedEventsRef.current.add(event.id);
            });

            cleanOldEvents();
          }
        }

        lastKnownVersionRef.current = lastCreatedAt;
      }

      if (shouldFetchNewEvents && eventsData?.events?.length > 0) {
        currentIntervalRef.current = minInterval;
      } else {
        currentIntervalRef.current = Math.min(
          currentIntervalRef.current + intervalIncrement,
          maxInterval,
        );
      }
    } catch (error) {
      console.error("Error checking updates:", error);
    } finally {
      isCheckingRef.current = false;
      scheduleNextCheck();
    }
  }, [minInterval, maxInterval, intervalIncrement]);

  const scheduleNextCheck = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    intervalRef.current = setTimeout(() => {
      checkForUpdates();
    }, currentIntervalRef.current);
  }, [checkForUpdates]);

  const loadInitialEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/reservas`);
      const eventsData = await response.json();

      if (eventsData.events && eventsData.events.length > 0) {
        const formattedEvents = eventsData.events.map((event: any) => ({
          ...event,
          date: dayjs(event.date),
          endTime: dayjs(event.endTime),
          createdAt: dayjs(event.createdAt),
        }));

        eventsData.events.forEach((event: any) => {
          processedEventsRef.current.add(event.id);
        });

        if (eventsData.events.length > 0) {
          const lastEvent = eventsData.events[eventsData.events.length - 1];
          lastKnownVersionRef.current = lastEvent.createdAt;
        }

        onEventsLoadedRef.current?.(formattedEvents);
      }
    } catch (error) {
      console.error("Error in initial load:", error);
    }
  }, []);

  const triggerLoad = useCallback(async () => {
    await loadInitialEvents();
    scheduleNextCheck();
  }, [loadInitialEvents, scheduleNextCheck]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    loadInitialEvents().then(scheduleNextCheck);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return {
    setOnEventsLoaded,
    triggerLoad,
  };
}
