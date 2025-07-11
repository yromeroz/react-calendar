import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import React from "react";
import { EventRenderer } from "./event-renderer";


export default function MonthViewBox({
  day,
  rowIndex,
}: {
  day: dayjs.Dayjs | null;
  rowIndex: number;
}) {
  const { openPopover, events } = useEventStore();

  const { userSelectedDate, setDate } = useDateStore();

  if (!day) {
    return (
      <div className="h-12 w-full border md:h-28 md:w-full lg:h-full"></div>
    );
  }

  // const isFirstDayOfMonth = day.date() === 1;

  const isToday = day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
  const isOutsideMonth = day.month() !== userSelectedDate.month();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate(day);
    openPopover();
  }; 

  return (
    <div
      className={cn(
        "group relative flex flex-col items-start gap-y-2 border",
        "transition-all hover:bg-gray-50",
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col items-start">
        {/* {rowIndex === 0 && (
          <h4 className="text-xs text-gray-500">
            {day.locale(es).format("ddd").toUpperCase()}
          </h4>
        )} */}
        <h4
          className={cn(
            "text-start text-sm font-semibold pl-2 pt-1",
            isToday &&
              "flex h-8 w-8 justify-items-start justify-start rounded-full bg-blue-600 text-white",
            isOutsideMonth && "text-gray-400",  
          )}
        >
          {/* {isFirstDayOfMonth ? day.locale(es).format("MMM D").toUpperCase() : day.format("D")} */}
          {day.format("D")}
        </h4>
      </div>
      <EventRenderer date={day} view="month" events={events} />
    </div>
  );
}
