"use client";

import React from "react";
import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import { useDateStore } from "@/lib/store";
import { useCallback, useState } from "react";
import EventPopover from "../event-popover";

export default function Create() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOpenPopover = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopoverOpen(true);
  }, []);

  const handleClosePopover = useCallback(() => {
    setIsPopoverOpen(false);
  }, []);

  const { userSelectedDate } = useDateStore();

  return (
    <>
      <Button
        title="Crear nueva reservación"
        variant="ghost"
        className="w-[140px] justify-center px-7 py-5 shadow border-2 rounded-2xl bg-slate-200"
        onClick={handleOpenPopover}
      >
        <LuPlus  size={20} className="text-gray-500 pr-1" />
        <span> Reservar </span>{""}
      </Button>
      {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={handleClosePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}
    </>
  );
}
