// FloatingButton.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import { useDateStore } from "@/lib/store";
import { useCallback, useState } from "react";
import EventPopover from "./event-popover";

export default function FloatingButton() {
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
        className="lg:hidden fixed bottom-10 right-16 bg-orange-300 hover:bg-gray-400 rounded-full border-2 shadow px-3 py-7 hover:px-4 hover:py-8 transition-all duration-300 z-40"
        onClick={handleOpenPopover}
      >
        <LuPlus  size={32} className="text-gray-100" />
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