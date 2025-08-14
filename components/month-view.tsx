'use client'


import React, { Fragment } from 'react'
import MonthViewBox from './month-view-box'
import { cn } from "@/lib/utils";
import { useDateStore } from '@/lib/store';
import { getWeekDays } from "@/lib/getTime";
import es from "dayjs/locale/es";


export default function MonthView() {
  const { userSelectedDate } = useDateStore();
  const { twoDMonthArray } = useDateStore();

  return (
    <>
       <div className="grid grid-cols-7 place-items-center px-2 py-1 border-2 rounded-xl">
             {/* Week View Header */}

             {getWeekDays(userSelectedDate).map(({ currentDate }, index) => (
               <div key={index} className="h-[clamp(0.75rem,5vmin,2.5rem)] w-10 flex flex-col items-center pt-1">
                 <div className={cn("text-[clamp(0.75rem,2.5vmin,1rem)]")}>
                   {currentDate.locale(es).format("ddd").toUpperCase()}
                 </div>
               </div>
             ))}

        </div>
        <section className={`grid grid-cols-7 grid-rows-${twoDMonthArray.length} h-[78vh] border-2 rounded-2xl`}>
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

