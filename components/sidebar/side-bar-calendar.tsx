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
    selectedMonthIndex,
    twoDMonthArray,
    userSelectedDate,
    setDate,
  } = useDateStore();
  const { selectedView } = useViewStore();
  const weeksOfMonth = getWeeks(selectedMonthIndex);

  function getDayClass(day: dayjs.Dayjs) {
    const nowDay = dayjs().format("DD-MM-YY");
    const currDay = day.format("DD-MM-YY");
    const selDay = userSelectedDate && userSelectedDate.format("DD-MM-YY");
    if (nowDay === currDay) {
      return "font-bold rounded-full bg-blue-500 text-white";
    } else if (currDay === selDay) {
      return "font-bold rounded-full bg-blue-100 text-blue-600";
    } else if (currDay.substring(3, 5) !== selDay.substring(3, 5)) {
      return "text-gray-300";
    } else {
      return " ";
    }
  }

  const handleDayClick = (day: dayjs.Dayjs) => {
    const currDay = day.format("DD-MM-YY");
    const selDay = userSelectedDate && userSelectedDate.format("DD-MM-YY");
    switch (selectedView) {
      case "month":
        if (currDay.substring(3, 5) < selDay.substring(3, 5)) {
          setMonth(selectedMonthIndex - 1);
          setDate(day);
        } else if (currDay.substring(3, 5) > selDay.substring(3, 5)) {
          setMonth(selectedMonthIndex + 1);
          setDate(day);
        } else setDate(day);
        break;
      case "week":
        if (currDay.substring(3, 5) < selDay.substring(3, 5)) {
          setMonth(selectedMonthIndex - 1);
          setDate(day);
        } else if (currDay.substring(3, 5) > selDay.substring(3, 5)) {
          setMonth(selectedMonthIndex + 1);
          setDate(day);
        } else setDate(day);
        break;
      case "day":
        setDate(day);
        break;
      default:
        break;
    }
  };

  const handlePrevClick = () => {
    setMonth(selectedMonthIndex - 1); 
    setDate(userSelectedDate.subtract(1, "month"));
  };

  const handleNextClick = () => { 
    setMonth(selectedMonthIndex + 1);
    setDate(userSelectedDate.add(1, "month"));
  };

  function capitalizeFirstLetter(str: string) {
    if (!str) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="my-6 p-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm">
          {capitalizeFirstLetter(
            dayjs(new Date(dayjs().year(), selectedMonthIndex))
            .locale(es)
            .format("MMMM YYYY")
            )}
        </h4>
        <div className="flex items-center gap-3">
          <MdKeyboardArrowLeft
            className="size-5 cursor-pointer font-bold"
            onClick={() => handlePrevClick()}
            // onClick={() => (selectedMonthIndex - 1)}
          />
          <MdKeyboardArrowRight
            className="size-5 cursor-pointer font-bold"
            onClick={() => handleNextClick()}
            // onClick={() => setMonth(selectedMonthIndex + 1)}
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
        <div className="grid w-6 grid-rows-5 gap-1 gap-y-3 rounded-sm bg-gray-200 p-1">
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

        <div className="grid grid-cols-7 grid-rows-5 gap-1 gap-y-3 rounded-sm p-1 text-xs">
          {twoDMonthArray.map((row, i) => (
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
