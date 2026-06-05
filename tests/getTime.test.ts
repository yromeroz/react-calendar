import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { isCurrentDay, getMonth, getWeekDays, getHours, getWeeks } from "@/lib/getTime";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);

describe("isCurrentDay", () => {
  it("returns true for today", () => {
    expect(isCurrentDay(dayjs())).toBe(true);
  });

  it("returns false for yesterday", () => {
    expect(isCurrentDay(dayjs().subtract(1, "day"))).toBe(false);
  });

  it("returns false for tomorrow", () => {
    expect(isCurrentDay(dayjs().add(1, "day"))).toBe(false);
  });

  it("compares at day granularity", () => {
    const now = dayjs();
    const sameDayDifferentTime = now.hour(23).minute(59);
    expect(isCurrentDay(sameDayDifferentTime)).toBe(true);
  });
});

describe("getHours", () => {
  it("returns 24 entries", () => {
    expect(getHours).toHaveLength(24);
  });

  it("starts at midnight", () => {
    expect(getHours[0].hour()).toBe(0);
    expect(getHours[0].minute()).toBe(0);
  });

  it("ends at 23:00", () => {
    expect(getHours[23].hour()).toBe(23);
  });

  it("each entry is an hour apart", () => {
    for (let i = 1; i < 24; i++) {
      expect(getHours[i].diff(getHours[i - 1], "hour")).toBe(1);
    }
  });
});

describe("getWeekDays", () => {
  it("returns 7 days", () => {
    const week = getWeekDays(dayjs("2026-06-01"));
    expect(week).toHaveLength(7);
  });

  it("starts on Sunday", () => {
    const week = getWeekDays(dayjs("2026-06-01"));
    expect(week[0].currentDate.day()).toBe(0);
  });

  it("contains the given date", () => {
    const date = dayjs("2026-06-15");
    const week = getWeekDays(date);
    const found = week.some((d) => d.currentDate.isSame(date, "day"));
    expect(found).toBe(true);
  });

  it("each entry has currentDate, today, isCurrentDay", () => {
    const week = getWeekDays(dayjs("2026-06-01"));
    for (const day of week) {
      expect(day).toHaveProperty("currentDate");
      expect(day).toHaveProperty("today");
      expect(day).toHaveProperty("isCurrentDay");
      expect(typeof day.today).toBe("boolean");
      expect(typeof day.isCurrentDay).toBe("function");
    }
  });

  it("isCurrentDay function works correctly on each entry", () => {
    const today = dayjs();
    const week = getWeekDays(today);
    for (const day of week) {
      const result = day.isCurrentDay(day.currentDate);
      expect(result).toBe(day.currentDate.isSame(today, "day"));
    }
  });

  it("today flag matches only current day", () => {
    const today = dayjs();
    const week = getWeekDays(today);
    for (const day of week) {
      if (day.currentDate.isSame(today, "day")) {
        expect(day.today).toBe(true);
      } else {
        expect(day.today).toBe(false);
      }
    }
  });
});

describe("getWeeks", () => {
  it("returns array of numbers", () => {
    const weeks = getWeeks(5, 2026);
    expect(Array.isArray(weeks)).toBe(true);
    expect(weeks.length).toBeGreaterThan(0);
    for (const w of weeks) {
      expect(typeof w).toBe("number");
    }
  });

  it("contains each week number in the month", () => {
    const weeks = getWeeks(5, 2026);
    const firstDay = dayjs("2026-06-01");
    const lastDay = dayjs("2026-06-30");
    let current = firstDay;
    while (current.isSameOrBefore(lastDay, "day")) {
      expect(weeks).toContain(current.week());
      current = current.add(1, "day");
    }
  });

  it("returns unique week numbers (no duplicates)", () => {
    const weeks = getWeeks(5, 2026);
    expect(new Set(weeks).size).toBe(weeks.length);
  });

  it("handles month crossing year boundary", () => {
    const weeks = getWeeks(0, 2026);
    expect(weeks.length).toBeGreaterThan(0);
  });

  it("handles December (month 11)", () => {
    const weeks = getWeeks(11, 2026);
    expect(weeks.length).toBeGreaterThan(0);
  });
});

describe("getMonth", () => {
  it("returns a 2D array", () => {
    const month = getMonth(5, 2026);
    expect(Array.isArray(month)).toBe(true);
    expect(month.length).toBeGreaterThan(0);
    expect(Array.isArray(month[0])).toBe(true);
  });

  it("each row has 7 days", () => {
    const month = getMonth(5, 2026);
    for (const week of month) {
      expect(week).toHaveLength(7);
    }
  });

  it("starts on a Sunday", () => {
    const month = getMonth(5, 2026);
    expect(month[0][0].day()).toBe(0);
  });

  it("contains all days of the month", () => {
    const month = getMonth(5, 2026);
    const allDays = month.flat();
    for (let d = 1; d <= 30; d++) {
      const found = allDays.some((day) => day.date() === d && day.month() === 5);
      expect(found).toBe(true);
    }
  });

  it("includes padding days from adjacent months", () => {
    const month = getMonth(5, 2026);
    const allDays = month.flat();
    const hasPadding = allDays.some((day) => day.month() !== 5);
    expect(hasPadding).toBe(true);
  });

  it("handles February in non-leap year", () => {
    const month = getMonth(1, 2023);
    const febDays = month.flat().filter((d) => d.month() === 1);
    expect(febDays).toHaveLength(28);
  });

  it("handles February in leap year", () => {
    const month = getMonth(1, 2024);
    const febDays = month.flat().filter((d) => d.month() === 1);
    expect(febDays).toHaveLength(29);
  });

  it("handles 31-day months", () => {
    const month = getMonth(0, 2026);
    const janDays = month.flat().filter((d) => d.month() === 0);
    expect(janDays).toHaveLength(31);
  });

  it("handles 30-day months", () => {
    const month = getMonth(3, 2026);
    const aprDays = month.flat().filter((d) => d.month() === 3);
    expect(aprDays).toHaveLength(30);
  });

  it("uses current month and year when not provided", () => {
    const month = getMonth();
    const today = dayjs();
    const daysThisMonth = month.flat().filter((d) => d.month() === today.month());
    expect(daysThisMonth.length).toBeGreaterThan(0);
  });

  it("all entries are valid Dayjs objects", () => {
    const month = getMonth(5, 2026);
    for (const day of month.flat()) {
      expect(day.isValid()).toBe(true);
    }
  });
});
