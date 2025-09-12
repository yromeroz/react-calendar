import { useDateStore, useEventStore, useFiltersStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { getHours, isCurrentDay } from "@/lib/getTime";
// import { getRooms } from "@/lib/data";
import { EventRenderer } from "./event-renderer";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function DayView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6; // Number of visible rooms
  // const rooms  = getRooms();
  const { rooms } = useFiltersStore();
  const [ showScrollLeft, setShowScrollLeft ] = useState(false);
  const [ showScrollRight, setShowScrollRight ] = useState(true);


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

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY"); 

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
    const prev =  Math.max(startIndex - 1, 0);
    setStartIndex(prev);
    setShowScrollLeft(prev > 0);
    setShowScrollRight(true);
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
    const next = Math.min(startIndex + 1, rooms.length - visibleCount);
    setStartIndex(next);
    setShowScrollRight(next < rooms.length - visibleCount);
    setShowScrollLeft(true);
  };  

  return (
    <>
      <div className="grid grid-cols-[auto_auto_1fr_1fr_1fr_1fr_1fr_1fr_auto] place-items-center pl-4 pr-2 py-1 border-2 rounded-2xl">
        {/* Date  Header */}
        <div className="flex w-16 flex-col items-center border-r border-gray-300 pr-4">  
          <div className={cn("text-xs", isToday && "text-blue-600")}>
            {userSelectedDate.locale(es).format("ddd").toUpperCase()}{" "}
          </div>{" "}
          <div
            className={cn(
              "h-10 w-10 rounded-full px-2 pt-1 text-xl",
              isToday && "bg-blue-600 text-white",
            )}
          >
            {userSelectedDate.format("DD")}{" "}
          </div>
        </div>

        {/* left arrow  button */} 
        <div className="flex flex-col items-center">
        { (rooms.length > visibleCount) && 
            showScrollLeft && 
            <MdKeyboardArrowLeft
              className="size-5 cursor-pointer font-bold text-[clamp(0.625rem,1.5vmin,0.875rem)] hover:text-blue-600"
              onClick={scrollLeft}
            /> }
        </div>

        {/* header rooms  list*/}
          {rooms.slice(startIndex, startIndex + visibleCount).map((room, index) => (
            <div key={index} className="relative">
            {/*  className="w-36 flex flex-col items-center"> */}
              <div className={cn("text-[clamp(0.625rem,1.5vw,1rem)] lg:text-base")}>
                {room.shortname.toUpperCase()}
              </div>
            </div>
          ))}
          
        {/* right arrow  button */}
        <div className="flex flex-col items-center">
          { (rooms.length > visibleCount) && showScrollRight && <MdKeyboardArrowRight
            className="size-5 cursor-pointer font-bold text-[clamp(0.625rem,1.5vmin,0.875rem)] hover:text-blue-600"
            onClick={scrollRight}
          /> }
        </div>
      </div>

      <ScrollArea className="h-[75vh] border-2 rounded-2xl">
        <div 
          ref={scrollContainerRef}
          className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr] pl-4 py-2">
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

          {/* Day/Boxes Column */}
          {rooms.slice(startIndex, startIndex + visibleCount).map(
            (room, index) => {
              return (
                <div 
                  key={index}
                  id={room.id.toString()}
                  className="relative border-r border-gray-300">
                  {getHours.map((hour, i) => (
                    <div
                      key={i}
                      className="relative flex h-16 cursor-pointer flex-col items-center gap-y-2 border-b border-gray-300 hover:bg-gray-100"
                      onClick={() => {
                        setDate(userSelectedDate.hour(hour.hour()));
                        openPopover();
                      }}
                    >
                      <EventRenderer
                        events={events.filter(roomEvents => roomEvents.rooms && roomEvents.rooms.includes(room.id))}
                        date={userSelectedDate.hour(hour.hour())}
                        view="day"
                      />
                    </div>
                  ))}
      
                  {/* Current time indicator */}
                  {isCurrentDay(userSelectedDate) && (
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
