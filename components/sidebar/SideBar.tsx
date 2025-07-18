import { cn } from "@/lib/utils";
import React from "react";
import Create from "./create";
import SideBarCalendar from "./side-bar-calendar";
import MyFilters from "./my-filters";
// import SearchUsers from "./search-users";
// import MyCalendars from "./my-calendars";
import { useToggleSideBarStore } from "@/lib/store";

export default function SideBar() {
  const { isSideBarOpen } = useToggleSideBarStore();
  return (
    <aside
      className={cn(
        "w-92 hidden px-2 py-3 transition-all duration-300 ease-in-out lg:block",
        !isSideBarOpen && "lg:hidden",
      )}
    >
      <Create />
      <SideBarCalendar />
      <MyFilters />
      {/* <SearchUsers /> */}
      {/* <MyCalendars /> */}
    </aside>
  );
}
