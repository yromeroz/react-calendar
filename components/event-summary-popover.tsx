'use client'

import React, { useRef, useEffect } from 'react'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import { Button } from "@/components/ui/button"
import { IoCloseSharp } from "react-icons/io5"
import { CalendarEventType, useFiltersStore } from '@/lib/store'

interface EventSummaryPopoverProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEventType
}

export function EventSummaryPopover({ isOpen, onClose, event }: EventSummaryPopoverProps) {

  const { rooms, courses, reservationTypes } = useFiltersStore();

  const roomNames = event.rooms
    .map((roomId) => {
      const room = rooms.find((room) => room.id === roomId);
      return room ? room.shortname : "-";
    })
    .join(", ");

  const course = courses.find(s => s.id === event.subject);
  const courseName = course?.name || "-";

  const resType = reservationTypes.find(t => t.id === event.reservationType);
  const resTypeName = resType?.name || "-";
      
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
        className="w-full max-w-md rounded-lg bg-white pl-4 pb-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between py-2">
          <h2 className="text-xl font-semibold">Detalles de la reserva</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <p><strong>Reserva:</strong> {event.title}</p>
          <p><strong>Salón:</strong> {roomNames}</p>
          {/* Format the date before displaying it */}
          {/* Add 3 hours to show 'America/Montevideo' timezone */}
          <p><strong>Fecha y hora: </strong> 
            {dayjs(event.date)
              .locale(es)
              .format(" dddd, MMM D, YYYY")
              .replace(/\b[a-z]/gi, (str) => str[0].toUpperCase() + str.slice(1).toLowerCase())
            }
            {dayjs(event.date)
              .add(3, 'hour')
              .locale(es)
              .format(" [h:mm A")},
            {dayjs(event.endTime)
              .add(3, 'hour')
              .locale(es)
              .format(" h:mm A]")}
          </p>
          <p><strong>Curso:</strong> {courseName}</p>
          <p><strong>Tipo de reserva:</strong> {resTypeName}</p>
        </div>
      </div>
    </div>
  )
}
