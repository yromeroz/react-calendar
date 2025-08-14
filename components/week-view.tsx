import { getHours, getWeekDays } from "@/lib/getTime";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { EventRenderer } from "./event-renderer";

export default function WeekView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();

  const { userSelectedDate, setDate } = useDateStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const scrollArea = scrollContainerRef.current.closest(
          "[data-radix-scroll-area-viewport]",
        ) as HTMLElement | null;

        if (scrollArea) {
          const hoursOffset = 7; // Scroll to 7 AM
          const hourHeight = 64; // Adjust this value based on actual rendered height
          scrollArea.scrollTop = hoursOffset * hourHeight;
        }
      }
    }, 50); // Delay ensures DOM is ready

    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };  
  }, []);

  return (
    <>
      <div className="h-[clamp(4rem,10vh,6rem)] grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center pl-4 py-1 border-2 rounded-2xl">
        <div className="w-16 border-r border-gray-300">
          <div className="relative h-16">
            <div className="absolute top-2 text-xs text-gray-600">GMT
              {dayjs().format("Z")}
            </div>
          </div>
        </div>

        {/* Week View Header */}

        {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={cn("text-[clamp(0.625rem,1.5vmin,0.75rem)]", today && "text-blue-600")}>
              {currentDate.locale(es).format("ddd").toUpperCase()}
            </div>
            <div
              className={cn(
                "h-10 w-10 rounded-full px-2 pt-1 text-[clamp(0.75rem,3vmin,1.25rem)]",
                today && "bg-blue-600 text-white",
              )}
            >
              {currentDate.format("DD")}{" "}
            </div>
          </div>
        ))}
      </div>

      {/* Time Column & Corresponding Boxes of time per each date  */}

      <ScrollArea className="h-[75vh] border-2 rounded-2xl">
        <div
          ref={scrollContainerRef}
          className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] pl-4 py-2"
        >
          {/* Time Column */}
          <div className="w-16 border-r border-gray-300">
            {getHours.map((hour, index) => (
              <div
                key={index}
                id={hour.format("HH") === "07" ? "start-hour-7" : undefined}
                className="relative h-16"
              >
                <div className="absolute -top-2 text-xs text-gray-600">
                  {hour.format("h:mm A")}
                </div>
              </div>
            ))}
          </div>

          {/* Week Days Corresponding Boxes */}

          {getWeekDays(userSelectedDate).map(
            ({ isCurrentDay, today }, index) => {
              const dayDate = userSelectedDate
                .startOf("week")
                .add(index, "day");

              return (
                <div key={index} className="relative border-r border-gray-300">
                  {getHours.map((hour, i) => (
                    <div
                      key={i}
                      className="relative flex h-16 cursor-pointer flex-col items-center gap-y-2 border-b border-gray-300 hover:bg-gray-100"
                      onClick={() => {
                        setDate(dayDate.hour(hour.hour()));
                        openPopover();
                      }}
                    >
                      <EventRenderer
                        events={events}
                        date={dayDate.hour(hour.hour())}
                        view="week"
                      />
                    </div>
                  ))}
                  {/* Current time indicator */}

                  {isCurrentDay(dayDate) && today && (
                    <div
                      className={cn("absolute h-0.5 w-full bg-red-500")}
                      style={{
                        top: `${(currentTime.hour() / 24) * 100}%`,
                      }}
                    />
                  )}
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
    </>
  );
}
