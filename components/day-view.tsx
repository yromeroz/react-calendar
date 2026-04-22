
import { useDateStore, useEventStore, useFiltersStore } from "@/lib/store";
import { cn, adjustColor } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { 
  getHours, 
  // isCurrentDay 
} from "@/lib/getTime";
// import { getRooms } from "@/lib/data";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function DayView() {
  // const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events, openEventSummary } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = scrollContainerRef; // alias for clarity
  const [startIndex, setStartIndex] = useState(8);
  const visibleCount = 15; // Number of visible hours
  const hoursOffset = 7; // Scroll to 7 AM
  const hourHeight = 64; // Height per room row (h-16)
  const { rooms } = useFiltersStore();
  const [ showScrollLeft, setShowScrollLeft ] = useState(false);
  const [ showScrollRight, setShowScrollRight ] = useState(true);

  // Columns measurement for precise positioning
  const [colWidth, setColWidth] = useState<number>(0);
  const [roomsColWidth, setRoomsColWidth] = useState<number>(64);
  const [hoursStartX, setHoursStartX] = useState<number>(0);

  // Memoize sliced time slots for performance
  // Memoize sliced time slots for performance
  // Note: use absolute timestamp diffs for positioning to avoid manual TZ hacks
  const visibleTimeSlots = React.useMemo(() => {
    const startOfVisible = userSelectedDate.startOf('day').add(startIndex, 'hour');
    return Array.from({ length: visibleCount }, (_, i) => startOfVisible.add(i, 'hour'));
  }, [startIndex, visibleCount, userSelectedDate]);

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

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    function measureCols() {
      const gridElement = gridRef.current;
      if (!gridElement) return;

      const roomsCol = gridElement.querySelector('.rooms-column') as HTMLElement | null;
      if (!roomsCol) return;

      // Prefer measuring the actual hour column elements to avoid cumulative rounding errors
      const hourCols = Array.from(gridElement.querySelectorAll(':scope > .hour-column')) as HTMLElement[];
      if (hourCols.length === 0) return;

      const firstHourRect = hourCols[0].getBoundingClientRect();
      const gridRect = gridElement.getBoundingClientRect();

      const firstHourLeft = firstHourRect.left - gridRect.left; // offset inside grid
      const hourW = firstHourRect.width;

      setRoomsColWidth(roomsCol.getBoundingClientRect().width);
      setColWidth(hourW);
      setHoursStartX(firstHourLeft);
    }

    measureCols();

    // Re-measure on resize and when the grid element changes size (e.g., sidebar toggle)
    const ro = new ResizeObserver(() => measureCols());
    ro.observe(grid);
    window.addEventListener('resize', measureCols);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureCols);
    };
  }, [visibleCount, rooms.length, visibleTimeSlots]);

  const dayEvents = React.useMemo(() =>
    events.filter(ev => ev.date.format('DD-MM-YY') === userSelectedDate.format('DD-MM-YY'))
  , [events, userSelectedDate]);

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
      <div className="grid grid-cols-[auto_auto_repeat(15,1fr)_auto] place-items-center pl-4 pr-2 py-1 border-2 rounded-2xl">
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
              {hour.format("h A")}
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
        {/* <MdKeyboardArrowRight /> */}
      </div>

      <ScrollArea className="h-[75vh] border-2 rounded-2xl">
        <div 
          ref={scrollContainerRef}
          className="relative grid grid-cols-[auto_repeat(15,1fr)] p-4 items-start">
          {/* Rooms Column */}
          <div className="rooms-column w-16 border-r border-gray-300">
            {rooms.map((room, index) => (
              <div 
                key={index}
                className="relative h-10"
                >
                <div className="absolute text-sm text-gray-600 mt-4 mr-1">
                  {room.shortname.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Day/Boxes Column (empty cells only; events rendered in overlay)*/}
          {visibleTimeSlots.map(
            (hour, index) => {
              return (
                <div 
                  key={index}
                  className="hour-column border-r border-gray-300 items-center ">
                  {rooms.map((room, idx) => (
                    <div
                      key={idx}
                      id={room.id.toString()}
                      className="relative h-10 border-b border-gray-300 cursor-pointer"
                      onClick={() => {
                        setDate(userSelectedDate.hour(hour.hour()));
                        // openPopover();
                      }}
                    />
                  ))}
                </div>
              );
            },
          )}

          {/* Overlay: absolute positioned events aligned to measured columns */}
          <div className="absolute inset-0 pointer-events-none">
            {dayEvents.map((event) => {
              const start = event.date;
              const end = event.endTime;

              // Calculate offsets using absolute timestamps to avoid manual timezone hacks
              const msPerHour = 1000 * 60 * 60;
              const startOffsetHours = (start.valueOf() - visibleTimeSlots[0].valueOf()) / msPerHour; // fractional, can be negative
              const durationHours = Math.max((end.valueOf() - start.valueOf()) / msPerHour, 0.25);

              // Skip events not visible in current window
              if (startOffsetHours + durationHours <= 0 || startOffsetHours >= visibleCount || colWidth === 0) return null;

              const visibleStartOffset = Math.max(startOffsetHours, 0);
              const visibleDuration = startOffsetHours < 0
                ? Math.min(durationHours + startOffsetHours, visibleCount - visibleStartOffset)
                : Math.min(durationHours, visibleCount - visibleStartOffset);

              const leftPx = hoursStartX + visibleStartOffset * colWidth;
              const widthPx = Math.max(visibleDuration * colWidth - 6, 28); // small padding

              const roomIndex = rooms.findIndex((r) => event.rooms && event.rooms.includes(r.id));
              if (roomIndex === -1) return null;

              // Find the actual row top via DOM so alignment stays correct when layout changes
              const grid = gridRef.current;
              const roomsCol = grid?.querySelector('.rooms-column') as HTMLElement | null;
              const roomCell = roomsCol?.children?.[roomIndex] as HTMLElement | null;
              const topPx = roomCell ? roomCell.offsetTop : roomIndex * hourHeight;

              const eventColor = event.color || "#98b8ff";
              const darker = adjustColor(eventColor, 120);
              const lighter = adjustColor(eventColor, 150);

              return (
                <div
                  key={event.id}
                  className="absolute rounded p-1 text-xs pointer-events-auto cursor-pointer overflow-hidden"
                  style={{
                    left: `${leftPx}px`,
                    top: `${topPx}px`,
                    width: `${widthPx}px`,
                    height: `${hourHeight - 32}px`,
                    background: darker,
                    color: '#000',
                    border: `2px solid ${eventColor}`,
                    boxSizing: 'border-box'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEventSummary(event);
                  }}
                >
                  <div className="truncate" style={{background: `var(--event-color)`}}>
                    {/* <strong className="mr-1">{start.format('h:mmA')} - {end.format('h:mmA')}</strong> */}
                    {event.name || '-'}
                  </div>
                </div>
              );
            })}
          </div>

        </div>       
      </ScrollArea>
    </>
  );
}
