"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
// import Image from "next/image";
import { MdCalendarMonth, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useDateStore, useToggleSideBarStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";
import es from "dayjs/locale/es";

export default function HeaderLeft() {
  // const todaysDate = dayjs();
  const { userSelectedDate, setDate, setMonth, selectedMonthIndex, setSidebarMonth, setSidebarDate } =
    useDateStore();

  const { setSideBarOpen } = useToggleSideBarStore();

  const { selectedView } = useViewStore();

  // const handleTodayClick = () => {
  //   switch (selectedView) {
  //     case "month":
  //       setMonth(dayjs().month());
  //       break;
  //     case "week":
  //       setDate(todaysDate);
  //       break;
  //     case "day":
  //       setDate(todaysDate);
  //       setMonth(dayjs().month());
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const handlePrevClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex - 1);
        setDate(dayjs().month(selectedMonthIndex - 1).date(1));
        setSidebarMonth(selectedMonthIndex - 1);
        setSidebarDate(dayjs().month(selectedMonthIndex - 1).date(1));
        break;
      case "week":
        const prevWeekDay = userSelectedDate.subtract(1, "week");        
        if (prevWeekDay.month() < selectedMonthIndex) {
          setMonth(selectedMonthIndex - 1);
          setDate(prevWeekDay);
          setSidebarMonth(selectedMonthIndex - 1);
        } else {  
          setDate(prevWeekDay);
        }  
        break;
      case "day":
        const prevDay = userSelectedDate.subtract(1, "day");        
        if (prevDay.month() < selectedMonthIndex) {
          setMonth(selectedMonthIndex - 1);
          setDate(prevDay);
          setSidebarMonth(selectedMonthIndex - 1);
        } else {  
          setDate(prevDay);
        }        
        break;
      default:
        break;
    }
  };

  const handleNextClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex + 1);        
        setDate(dayjs().month(selectedMonthIndex + 1).date(1));
        setSidebarMonth(selectedMonthIndex + 1);
        setSidebarDate(dayjs().month(selectedMonthIndex + 1).date(1));
        break;
      case "week":
        const nextWeekDay = userSelectedDate.add(1, "week");        
        if (nextWeekDay.month() > selectedMonthIndex) {
          setMonth(selectedMonthIndex + 1);
          setDate(nextWeekDay);
          setSidebarMonth(selectedMonthIndex + 1);
        } else {         
          setDate(nextWeekDay);
        }        
        break;        
      case "day":
        const nextDay = userSelectedDate.add(1, "day");        
        if (nextDay.month() > selectedMonthIndex) {        
          setMonth(selectedMonthIndex + 1);
          setDate(nextDay);
          setSidebarMonth(selectedMonthIndex + 1);
        } else {
          setDate(nextDay);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Sidebar Toggle and Calendar Icon */}
      <div className="hidden items-center lg:flex">
        <Button
          variant="ghost"
          className="rounded-full p-2"
          onClick={() => setSideBarOpen()}
        >
          <Menu className="size-6" />
        </Button>
        {/* <Image
          src={`/img/calendar_${todaysDate.date().toString()}_2x.png`}
          width={40}
          height={40}
          alt="icon"
        /> */}
        <MdCalendarMonth size={32} className="text-gray-500 ml-1" />
        <h1 className="text-xl px-1"> Calendario </h1>
        <div className="box-sizing-content border-0 ml-12 text-xs "/>
      </div>

      {/* Today Button */}
      {/* <Button variant="outline" onClick={handleTodayClick}>
        Hoy
      </Button> */}

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        <MdKeyboardArrowLeft
          className="size-6 cursor-pointer font-bold"
          onClick={handlePrevClick}
        />
        <MdKeyboardArrowRight
          className="size-6 cursor-pointer font-bold"
          onClick={handleNextClick}
        />
      </div>

      {/* Current Month and Year Display */}
      <h1 className="hidden text-xl lg:block">
        {dayjs(new Date(dayjs().year(), selectedMonthIndex)).locale(es).format(
          "MMMM YYYY",
        ).toUpperCase()}
      </h1>
    </div>
  );
}
