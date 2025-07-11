'use client'


import React, { Fragment } from 'react'
import MonthViewBox from './month-view-box'
import { cn } from "@/lib/utils";
import { useDateStore } from '@/lib/store';
import { getWeekDays } from "@/lib/getTime";
import es from "dayjs/locale/es";


export default function MonthView() {
  const { userSelectedDate, setDate } = useDateStore();
  const { twoDMonthArray } = useDateStore();

  return (
    <>
       <div className="grid grid-cols-7 place-items-center px-2 pt-4 border-2 rounded-xl">
             {/* Week View Header */}

             {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) => (
               <div key={index} className="h-10 w-10 flex flex-col items-center">
                 <div className={cn("text-sm")}>
                   {currentDate.locale(es).format("ddd").toUpperCase()}
                 </div>
               </div>
             ))}

        </div>
        <section className={`grid grid-cols-7 grid-rows-${twoDMonthArray.length} h-[75vh] border-2 rounded-2xl`}>
            {twoDMonthArray.map((row, i) => (
               <Fragment key={i}>
                 {row.map((day, index) => (
                   <MonthViewBox key={index} day={day} rowIndex={i} />
                 ))}
               </Fragment>
             ))}
           </section>           
    </>
  )
}

