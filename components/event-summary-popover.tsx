'use client'

import React, { useRef, useEffect } from 'react'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import { Button } from "@/components/ui/button"
import { IoCloseSharp } from "react-icons/io5"
import { CalendarEventType } from '@/lib/store'

interface EventSummaryPopoverProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEventType
}

export function EventSummaryPopover({ isOpen, onClose, event }: EventSummaryPopoverProps) {

    
    
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Resumen de la reserva</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <p><strong>Reserva:</strong> {event.title}</p>
          {/* Format the date before displaying it */}
          <p><strong>Fecha y hora:</strong> {dayjs(event.date).locale(es).format("dddd, MMMM D, YYYY h:mm A")}</p>
          {/* Add more event details here */}
        </div>
      </div>
    </div>
  )
}
