"use client";

import React, { Fragment } from "react";
import MonthViewBox from "./month-view-box";
import { cn } from "@/lib/utils";
import { useDateStore, usePaginateDirectionStore } from "@/lib/store";
import { getWeekDays } from "@/lib/getTime";
import es from "dayjs/locale/es";
import { motion, AnimatePresence } from "framer-motion";

// const variants = {
//   enter: (direction: number) => ({
//     x: direction > 0 ? 300 : -300,
//     opacity: 0,
//   }),
//   center: {
//     x: 0,
//     opacity: 1,
//     position: "relative",
//     top: 0,
//     left: 0,
//     right: 0,
//   },
//   exit: (direction: number) => ({
//     x: direction > 0 ? -300 : 300,
//     opacity: 0,
//   }),
// };
export default function MonthView() {
  const { userSelectedDate } = useDateStore();
  const { twoDMonthArray } = useDateStore();
  const { direction } = usePaginateDirectionStore();

  return (
    <>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`${userSelectedDate.year.toString()}-${userSelectedDate.month.toString()}`}
          // custom={direction}
          // variants={variants}
          initial={{ opacity: 0, x: direction * 300 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.2,
              type: "spring",
              visualDuration: 0.3,
              bounce: 0.4,
            },
          }}
          exit={{ opacity: 0, x: direction * -300 }}
        >
          <div className="grid grid-cols-7 place-items-center rounded-xl border-2 px-2 py-1">
            {/* Week View Header */}

            {getWeekDays(userSelectedDate).map(({ currentDate }, index) => (
              <div
                key={index}
                className="flex h-[clamp(0.75rem,5vmin,2.5rem)] w-10 flex-col items-center pt-1"
              >
                <div className={cn("text-[clamp(0.75rem,2.5vmin,1rem)]")}>
                  {currentDate.locale(es).format("ddd").toUpperCase()}
                </div>
              </div>
            ))}
          </div>
          <section
            className={`grid grid-cols-7 grid-rows-${twoDMonthArray.length} h-[78vh] rounded-2xl border-2`}
          >
            {twoDMonthArray.map((row, i) => (
              <Fragment key={i}>
                {row.map((day, index) => (
                  <MonthViewBox key={index} day={day} rowIndex={i} />
                ))}
              </Fragment>
            ))}
          </section>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
