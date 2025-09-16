"use client"

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddEventDateProps {
  onDateChange: (date: Date) => void;
}

export function AddEventDate({onDateChange}: AddEventDateProps) {
  const [open, setOpen] = React.useState(false);
  const [selDate, setSelDate] = React.useState<Date | undefined>(undefined);

  const handleDateSelected = (date: Date | undefined) => {
    if(date) {
      setSelDate(date);
      onDateChange(date);
      setOpen(false);
    }
  }

  
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-32 justify-between font-normal"
          >
            {selDate instanceof Date ? selDate.toLocaleDateString() : "Elija fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto overflow-hidden p-0" 
          align="start"
        >
          <Calendar
            mode="single"
            selected={selDate}
            captionLayout="dropdown"
            onSelect={handleDateSelected}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
