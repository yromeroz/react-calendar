import { getWeeks } from "@/lib/getTime";
import { useDateStore, useViewStore } from "@/lib/store";
// import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import React, { Fragment } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function SideBarCalendar() {
  const {
    setMonth,
    twoDMonthSidebarArray,
    setDate,
    sidebarMonthIndex,
    setSidebarMonth,
    sidebarViewDate,
    setSidebarDate
  } = useDateStore();
  const { selectedView } = useViewStore();
  const weeksOfMonth = getWeeks(sidebarMonthIndex);

  function getDayClass(day: dayjs.Dayjs) {
    const nowDay = dayjs().locale(es).format("DD-MM-YY");
    const currDay = day.locale(es).format("DD-MM-YY");
    const selDay = sidebarViewDate && sidebarViewDate.locale(es).format("DD-MM-YY");
    if (nowDay === currDay) {
      return "font-bold rounded-full bg-blue-500 text-white";
    } else if (currDay === selDay) {
      return "font-bold rounded-full bg-blue-100 text-blue-600";
    } else if (day.month() !== sidebarMonthIndex) {
        return "text-gray-300";
    } else {
      return " ";
    }
  }

  const handleDayClick = (day: dayjs.Dayjs) => {
    switch (selectedView) {
      case "month":
      case "week":  
      case "day":
        setSidebarDate(day);
        if (day.month() !== sidebarMonthIndex) {         
          setSidebarMonth(day.month());
        }        
        setDate(day);
        setMonth(day.month());
        break;
      default:
        break;
    }
  };

  const handlePrevClick = (): void => {
    const prevDay = sidebarViewDate.subtract(1, "month");
    setSidebarDate(prevDay);
    setDate(prevDay); 
    if (sidebarMonthIndex ===  0) {
      setSidebarMonth(11);
    } else {
      setSidebarMonth(sidebarMonthIndex - 1);
    }     
  };

  const handleNextClick = (): void => {
    const nextDay = sidebarViewDate.add(1, "month");
    setSidebarDate(nextDay);
    setDate(nextDay); 
    if (sidebarMonthIndex ===  11) {
      setSidebarMonth(0);
    } else {
      setSidebarMonth(sidebarMonthIndex + 1);
    }    
  };

  function capitalizeFirstLetter(str: string) {
    if (!str) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="my-6 p-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm">
          {capitalizeFirstLetter(sidebarViewDate
              .locale(es)
              .format("MMMM YYYY"),  
          )}
        </h4>
        <div className="flex items-center gap-3">
          <MdKeyboardArrowLeft
            className="size-5 cursor-pointer font-bold"
            onClick={() => {
              handlePrevClick();
            }
            }
          />
          <MdKeyboardArrowRight
            className="size-5 cursor-pointer font-bold"
            onClick={() => {
              handleNextClick();
              }
            }
          />
        </div>
      </div>

      {/* Header Row: Days of the Week */}
      <div className="mt-2 grid grid-cols-[auto_1fr]">
        <div className="w-6"></div>
        <div className="grid grid-cols-7 text-xs">
          {["D", "L", "M", "X", "J", "V", "S"].map((day, i) => (
            <span key={i} className="py-1 text-center">
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content: Weeks and Days */}
      <div className="mt-2 grid grid-cols-[auto_1fr] text-xs">
        {/* Week Number  column */}
        <div className="grid w-6 grid-rows-4 gap-1 gap-y-3 rounded-sm bg-gray-200 p-1">
          {weeksOfMonth.map((week, i) => (
            <span
              key={i}
              className="flex h-5 w-5 items-center justify-center text-gray-500"
            >
              {week}
            </span>
          ))}
        </div>

        {/* Dates grid */}

        <div className="grid grid-cols-7 grid-rows-4 gap-1 gap-y-3 rounded-sm p-1 text-xs">
          {twoDMonthSidebarArray.map((row, i) => (
            <Fragment key={i}>
              {row.map((day, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleDayClick(day);
                  }}
                  className={`flex h-5 w-5 items-center justify-center ${getDayClass(day)}`}
                  // className={cn(
                  //   "flex h-5 w-5 items-center justify-center rounded-full",
                  //   day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") &&
                  //     "bg-blue-600 text-white",
                  // )}
                >
                  <span>{day.format("D")}</span>
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
