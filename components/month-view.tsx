'use client'


import React, { Fragment } from 'react'
import MonthViewBox from './month-view-box'
import { useDateStore } from '@/lib/store';

export default function MonthView() {

  const { twoDMonthArray } = useDateStore();
  return (
    <section className={`grid grid-cols-7 grid-rows-${twoDMonthArray.length} lg:h-full border-2 rounded-2xl`}>
     {twoDMonthArray.map((row, i) => (
        <Fragment key={i}>
          {row.map((day, index) => (
            <MonthViewBox key={index} day={day} rowIndex={i} />
          ))}
        </Fragment>
      ))}
    </section>
  )
}
