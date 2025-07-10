"use client";

import React from "react";
import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";
import { useDateStore } from "@/lib/store";
import { useCallback, useState } from "react";
// import { SvgIcons } from "../svg-icons";
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
        variant="ghost"
        className="w-[100px] justify-center py-5 shadow border-2"
        onClick={handleOpenPopover}
      >
        <span> Reservar </span>{" "}
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
