
import { useDateStore, useEventStore, useFiltersStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { getHours, isCurrentDay } from "@/lib/getTime";
import { EventRenderer } from "./event-renderer";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function DayView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();
  const { rooms } = useFiltersStore();

  const hours = getHours; // array of dayjs objects representing each hour slot
  const hoursContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollToHourRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(dayjs()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Scroll horizontally to 07:00 on mount
  useEffect(() => {
    setTimeout(() => {
      if (!hoursContainerRef.current) return;
      const targetIdx = hours.findIndex(h => h.add(3, "hour").format("HH") === "07");
      if (targetIdx >= 0) {
        const cell = hoursContainerRef.current.querySelectorAll<HTMLDivElement>(".hour-cell")[targetIdx];
        if (cell) cell.scrollIntoView({ behavior: "auto", inline: "start" });
      }
    }, 50);
  }, [hours]);

  const formatSlotKey = (date: dayjs.Dayjs, hour: dayjs.Dayjs) =>
    date.format("DD-MM-YY") + " " + hour.hour();

  const eventsForRoomHour = (roomId: number, hour: dayjs.Dayjs) =>
    events.filter((ev) => {
      if (!ev.rooms || !Array.isArray(ev.rooms)) return false;
      if (!ev.rooms.includes(roomId)) return false;
      const evSlot = dayjs(ev.date).format("DD-MM-YY HH");
      const slot = userSelectedDate.hour(hour.hour()).format("DD-MM-YY HH");
      return evSlot === slot;
    });

  return (
    <>
      {/* Header: date and simple controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className={cn("text-xs", isCurrentDay(userSelectedDate) && "text-blue-600")}>
            {userSelectedDate.locale(es).format("ddd").toUpperCase()}
          </div>
          <div className={cn("h-10 w-10 rounded-full px-2 pt-1 text-xl", isCurrentDay(userSelectedDate) && "bg-blue-600 text-white")}>
            {userSelectedDate.format("DD")}
          </div>
        </div>
      </div>

      {/* Hours header (scrollable horizontally) */}
      <div className="flex items-stretch border-b border-gray-200">
        <div className="w-32 flex items-center justify-start pl-4 text-sm font-medium">Aula</div>
        <MdKeyboardArrowLeft />
        <div ref={hoursContainerRef} className="flex overflow-x-auto no-scrollbar">
          {hours.map((hour, idx) => (
            <div key={idx} className="hour-cell flex-shrink-0 w-28 py-2 px-3 border-l border-gray-200 text-xs text-center">
              {hour.add(3, "hour").format("h A")}
            </div>
          ))}
        </div>
        <MdKeyboardArrowRight />
      </div>

      {/* Rooms rows */}
      <ScrollArea className="h-[70vh] border-2 rounded-2xl mt-2">
        <div className="flex flex-col">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-start border-b border-gray-200 hover:bg-gray-50">
              {/* Room name column */}
              <div className="w-32 py-3 pl-4 pr-2 text-sm font-medium">{room.shortname}</div>

              {/* Hours row for this room (horizontal scroll) */}
              <div className="flex overflow-x-auto w-full no-scrollbar">
                {hours.map((hour, idx) => {
                  const slotEvents = eventsForRoomHour(Number(room.id), hour);
                  return (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-28 h-20 border-l border-gray-200 p-1 relative"
                      onClick={() => {
                        setDate(userSelectedDate.hour(hour.hour()));
                        openPopover();
                      }}
                    >
                      {/* Render events for this slot */}
                      {slotEvents.map((ev, i) => (
                        <EventRenderer
                          key={ev.id ?? i}
                          events={[ev]}
                          date={userSelectedDate.hour(hour.hour())}
                          view="day"
                        />
                      ))}

                      {/* current time indicator (only for same day and matching hour) */}
                      {isCurrentDay(userSelectedDate) && currentTime.hour() === hour.hour() && (
                        <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-red-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
