'use client'

import React, { useRef, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import { Button } from "@/components/ui/button"
import { IoCloseSharp } from "react-icons/io5"
import { CalendarEventType, useFiltersStore } from '@/lib/store'
import { useAuth } from "@/context/AuthContext";

interface EventSummaryPopoverProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEventType
  urlParam?: string
}

export function EventSummaryPopover({ isOpen, onClose, event, urlParam }: EventSummaryPopoverProps) {
  const [showDetails, setShowDetails] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { rooms, courses, reservationTypes } = useFiltersStore();

  const sendTokenToIframe = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow) return;
      let origin = "*";
      try {
        origin = new URL(urlParam || "").origin || "*";
      } catch (err) {
        // Leave origin as * if URL parsing fails
      }
      iframeWindow.postMessage({ token }, origin);
    } catch (error) {
      console.error("Error enviando token al iframe:", error);
    }
  };

  React.useEffect(() => {
    if (showDetails) {
      setIframeLoaded(false);
      // Try to send token shortly after opening in case the iframe is already available
      const t = setTimeout(() => sendTokenToIframe(), 500);
      return () => clearTimeout(t);
    }
  }, [showDetails]);

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

  const { isAuthenticated } = useAuth();

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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50"
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
          <p><strong>Reserva:</strong> {event.name}</p>
          <p><strong>Salón:</strong> {roomNames}</p>
          {/* Format the date before displaying it */}
          <p><strong>Fecha y hora: </strong> 
            {dayjs(event.date)
              .locale(es)
              .format(" dddd, MMM D, YYYY")
              .replace(/\b([a-záéíóúüñ]+)\b/gi, (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
            }
            {dayjs(event.date)
              .locale(es)
              .format(" [h:mm A")},
            {dayjs(event.endTime)
              .locale(es)
              .format(" h:mm A]")}
          </p>
          <p><strong>Materia:</strong> {courseName}</p>
          <p><strong>Tipo de reserva:</strong> {resTypeName}</p>
          {
            isAuthenticated && (
              <p>
                <button 
                  className="text-blue-600 hover:underline" 
                  onClick={() => setShowDetails(true)}>
                  Más detalles...
                </button>
              </p>
            )
          }

          {showDetails && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Detalle externo</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>Volver</Button>
              </div>
              {urlParam ? (
                <div className="relative">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-60">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span className="text-sm text-gray-600">Cargando...</span>
                      </div>
                    </div>
                  )}

                  <iframe
                    ref={iframeRef}
                    title="Reservas Detalle"
                    src={`${urlParam}?ReservaId=${event.id}`}
                    className="w-full h-80 border rounded"
                    onLoad={() => {
                      setIframeLoaded(true);
                      // Enviar token tan pronto carga
                      sendTokenToIframe();
                    }}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">URL de reserva no disponible</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
