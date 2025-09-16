'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"

export default function AddEndTime({
  onTimeSelect,
  initialTime = ''
}: {
  onTimeSelect: (time: string) => void;
  initialTime?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState(initialTime);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const timeButtonRef = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if(isOpen && initialTime && timeButtonRef.current[initialTime]) {
      timeButtonRef.current[initialTime]?.scrollIntoView({
          behavior: 'auto',
          block: 'center', 
        });
      }    

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, initialTime]);

  const generateTimeIntervals = () => {
    const intervals = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        intervals.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        )
      }
    }
    return intervals
  }

  const handleTimeSelect = (time: string) => {
    setSelectedEndTime(time)
    onTimeSelect(time);
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="w-24 justify-between"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {selectedEndTime}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-24 rounded-md border bg-popover text-popover-foreground shadow-md">
          <ScrollArea className="h-60" ref={scrollAreaRef}>
            <div className="p-1">
              {generateTimeIntervals().map((time) => (
                <Button
                  ref={(el) => { timeButtonRef.current[time] = el; }}
                  key={time}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleTimeSelect(time)}
                  type="button"
                >
                  {time}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}