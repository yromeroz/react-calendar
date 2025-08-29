"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Create from "./create";
import SideBarCalendar from "./side-bar-calendar";
import MyFilters from "./my-filters";
import { useToggleSideBarStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";

export default function SideBar() {
  const { isSideBarOpen } = useToggleSideBarStore();

  return (
    <AnimatePresence mode="wait">
        {isSideBarOpen == true ? (
        <motion.aside
          key="open"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3 }}
          // transition={{ type: "spring", stiffness: 200, damping: 30 }}      
          className={cn(
            "w-92 hidden px-2 py-3 lg:block",
          )} 
        >
          <Create />
          <SideBarCalendar />
          <MyFilters />
        </motion.aside>
      ) : (
        <motion.aside
          key="closed"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: -100, opacity: 1 }}
          exit={{ x: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "lg:hidden",
          )} 
        >
          <Create />
          <SideBarCalendar />
          <MyFilters />
        </motion.aside>
        )}
    </AnimatePresence>  
  );
}
