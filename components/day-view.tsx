
import { useDateStore, useEventStore, useFiltersStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { 
  getHours, 
  // isCurrentDay 
} from "@/lib/getTime";
// import { getRooms } from "@/lib/data";
import { EventRenderer } from "./event-renderer";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function DayView() {
  // const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(4);
  const visibleCount = 7; // Number of visible rooms
  const hoursOffset = 7; // Scroll to 7 AM
  const hourHeight = 64; // Adjust this value based on actual rendered height
  const { rooms } = useFiltersStore();
  const [ showScrollLeft, setShowScrollLeft ] = useState(false);
  const [ showScrollRight, setShowScrollRight ] = useState(true);

  // Memoize sliced time slots for performance
  const visibleTimeSlots = React.useMemo(
    () => getHours.slice(startIndex, startIndex + visibleCount),
    [startIndex, visibleCount]
  );  

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const scrollArea = scrollContainerRef.current.closest(
          "[data-radix-scroll-area-viewport]",
        ) as HTMLElement | null;

        if (scrollArea) {
          scrollArea.scrollTop = hoursOffset * hourHeight;
        }
      }
    }, 50); // Delay ensures DOM is ready

    // const interval = setInterval(() => {
    //   setCurrentTime(dayjs());
    // }, 60000); // Update every minute

      return () => {
      clearTimeout(timer);
      // clearInterval(interval);
    };
  }, []);

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY"); 

  const scrollLeft = () => {
    const prev =  Math.max(startIndex - 1, 0);
    setStartIndex(prev);
    setShowScrollLeft(prev > 0);
    setShowScrollRight(true);
    scrollRef.current?.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    const next = Math.min(startIndex + 1, rooms.length - visibleCount);
    setStartIndex(next);
    setShowScrollRight(next < rooms.length - visibleCount);
    setShowScrollLeft(true);
    scrollRef.current?.scrollBy({ left: 100, behavior: "smooth" });
  };  

  return (
    <>
      <div className="grid grid-cols-[auto_auto_repeat(7,1fr)_auto] place-items-center pl-4 pr-2 py-1 border-2 rounded-2xl">
        {/* Date Header */}
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
        { (getHours.length > visibleCount) && 
            showScrollLeft && 
            <MdKeyboardArrowLeft
              aria-label="Scroll left"
              className="size-5 cursor-pointer font-bold text-[clamp(0.625rem,1.5vmin,0.875rem)] hover:text-blue-600"
              onClick={scrollLeft}
            /> }
        </div>

        {/* Header: Time slots as columns */}
          {/* Time slot headers */}
          {visibleTimeSlots.map((hour, idx) => (
            <div key={idx} className="text-sm text-gray-600">
              {hour.add(3, "hour").format("h:mm A")}
            </div>
          ))}

        {/* right arrow  button */}
        <div className="flex flex-col items-center">
          { (getHours.length > visibleCount && showScrollRight) && (
          <MdKeyboardArrowRight
            aria-label="Scroll right"
            className="size-5 cursor-pointer font-bold text-[clamp(0.625rem,1.5vmin,0.875rem)] hover:text-blue-600"
            onClick={scrollRight}
          /> 
          )}
        </div>
        <MdKeyboardArrowRight />
      </div>

      <ScrollArea className="h-[75vh] border-2 rounded-2xl">
        <div 
          ref={scrollContainerRef}
          className="grid grid-cols-[auto_repeat(7,1fr)] p-4 items-center">
          {/* Rooms Column */}
          <div className="w-16 border-r border-gray-300">
            {rooms.map((room, index) => (
              <div 
                key={index}
                className="relative h-16"
                >
                <div className="absolute text-sm text-gray-600 mt-4 mr-1">
                  {room.shortname.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Day/Boxes Column */}
          {visibleTimeSlots.map(
            (hour, index) => {
              return (
                <div 
                  key={index}
                  className="relative border-r border-gray-300">
                  {rooms.map((room, idx) => (
                    <div
                      key={idx}
                      id={room.id.toString()}
                      className="relative flex h-16 cursor-pointer flex-col items-center gap-y-2 border-b border-gray-300 hover:bg-gray-100"
                      onClick={() => {
                        setDate(userSelectedDate.hour(hour.hour()));
                        openPopover();
                      }}
                    >
                      <EventRenderer
                        events={events.filter(event => event.rooms && event.rooms.includes(room.id))}
                        date={userSelectedDate.hour(hour.hour())}
                        view="day"
                      />
                    </div>
                  ))}
      
                  {/* Current time indicator */}
                  {/* {isCurrentDay(userSelectedDate) && (
                    <div
                      className={cn("absolute h-0.5 w-full bg-red-500")}
                      style={{
                        top: `${(currentTime.hour() / 24) * 100}%`,
                      }}
                    />
                  )} */}
                </div>
              );
            },
          )}

        </div>       
      </ScrollArea>
    </>
  );
}
