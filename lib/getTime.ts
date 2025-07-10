import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

export const isCurrentDay = (day: dayjs.Dayjs) => {
  return day.isSame(dayjs(), "day");
};

export const getMonth = (month = dayjs().month()) => {
  const year = dayjs().year();
  const firstDayofMonth = dayjs().set("month", month).startOf("month").day();

  let dayCounter = -firstDayofMonth;

  const numberOfWeeks = getWeeks(month).length;
  return Array.from({ length: numberOfWeeks }, () =>
    Array.from({ length: 7 }, () => dayjs(new Date(year, month, ++dayCounter))),
  );
};

export const getWeekDays = (date: dayjs.Dayjs) => {
  const startOfWeek = date.startOf("week");

  const weekDates = [];

  // Loop through the 7 days of the week
  for (let i = 0; i < 7; i++) {
    const currentDate = startOfWeek.add(i, "day");
    weekDates.push({
      currentDate,
      today:
        currentDate.toDate().toDateString() === dayjs().toDate().toDateString(),
      isCurrentDay,
    });
  }

  return weekDates;
};

export const getHours = Array.from({ length: 24 }, (_, i) =>
  dayjs().startOf("day").add(i, "hour"),
);


// Function to generate weeks of the month dynamically


export const getWeeks  = (monthIndex: number) => {
  const year = dayjs().year();
  const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1));
  const lastDayOfMonth = dayjs(new Date(year, monthIndex + 1, 0)); // Last day of the month

  const weeks: number[] = [];

  // Loop from the first day to the last day of the month
  let currentDay = firstDayOfMonth;
  while (
    currentDay.isBefore(lastDayOfMonth) ||
    currentDay.isSame(lastDayOfMonth)
  ) {
    const weekNumber = currentDay.week();   //This requires the WeekOfYear plugin to work as imported above
    if (!weeks.includes(weekNumber)) {
      weeks.push(weekNumber);
    }
    currentDay = currentDay.add(1, "day"); // Move to the next day
  }

  return weeks;
}


// export function getMonthDaysMatrix(monthIndex: number): Dayjs[][] {
//   const today = dayjs(); // Current date for reference
//   const year = today.year(); // Always use current year unless specified
//   const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1)); // First day of the month

//   const startDay = firstDayOfMonth.startOf("month").day(); // 0(Sun) - 6(Sat)
//   // const totalDays = firstDayOfMonth.daysInMonth() || 30;
//   const numberOfWeeks = getWeeks(monthIndex).length;

//   let currentDate = firstDayOfMonth.subtract(startDay, "day"); // Start from Sunday before first of the month

//   const weeks: Dayjs[][] = [];

//   for (let i = 0; i < numberOfWeeks; i++) {
//     const week: Dayjs[] = [];
//     for (let j = 0; j < 7; j++) {
//       week.push(currentDate);
//       currentDate = currentDate.add(1, "day");
//     }
//     weeks.push(week);
//   }

//   return weeks;
// }
