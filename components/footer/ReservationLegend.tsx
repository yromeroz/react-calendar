"use client";

import { useFiltersStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { adjustColor } from "@/lib/utils";

type Carrera = { id: number; name: string; color: string };

export function ReservationLegend() {
  const { reservationTypes } = useFiltersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [carreras, setCarreras] = useState<Carrera[]>([]);

  useEffect(() => {
    fetch("/api/carreras")
      .then((res) => res.json())
      .then((data) => setCarreras(data.carreras || []))
      .catch(console.error);
  }, []);

  if (reservationTypes.length === 0 && carreras.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-white p-3 shadow-lg transition-colors hover:bg-gray-50"
          title="Mostrar leyenda de colores"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </button>
      ) : (
        <div className="w-72 rounded-lg bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Leyenda de Colores</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {reservationTypes.length > 0 && (
            <>
              <div className="mb-3">
                <h4 className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Tipos de Reserva
                </h4>
                <div className="space-y-1">
                  {reservationTypes.map((type) => (
                    <div key={type.id} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 flex-shrink-0 rounded"
                        style={{
                          backgroundColor: adjustColor(type.color, 120),
                          border: `2px solid ${type.color}`,
                        }}
                      />
                      <span className="truncate text-sm text-gray-600">
                        {type.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {carreras.length > 0 && (
            <>
              <div className="border-t pt-3">
                <h4 className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Carreras
                </h4>
                <div className="space-y-1">
                  {carreras.map((carrera) => (
                    <div key={carrera.id} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 flex-shrink-0 rounded"
                        style={{
                          backgroundColor: adjustColor(carrera.color, 120),
                          border: `2px solid ${carrera.color}`,
                        }}
                      />
                      <span className="truncate text-sm text-gray-600">
                        {carrera.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-3 border-t pt-3 text-xs text-gray-400">
            Color de relleno de cada reserva
          </div>
        </div>
      )}
    </div>
  );
}
