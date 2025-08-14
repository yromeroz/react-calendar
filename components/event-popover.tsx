"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea"; 
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import {
  HiOutlineMenuAlt4,
  HiOutlineUser,
} from "react-icons/hi";
import {
  MdNotes,
  MdOutlineCategory,
  MdOutlineClass,
  MdOutlineMeetingRoom,
} from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import AddTime from "./add-time";
import AddEndTime from "./add-end-time";
import { createEvent } from "@/app/actions/event-actions";
// import { cn } from "@/lib/utils";
import { getRooms, getCourses, getReservationTypes } from "@/lib/data";
import { capitalizeFirstLetter } from "@/lib/utils";

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export default function EventPopover({
  isOpen,
  onClose,
  date,
}: EventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedTime, setSelectedTime] = useState("07:00");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedRoom, setRoom]  = useState("");
  const [selectedCourse, setCourse] = useState("");
  const [selectedReservationType, setReservationType] = useState("");
  const rooms = getRooms();
  const courses = getCourses();
  const reservationTypes = getReservationTypes();  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    // console.log("Form Data:", Object.fromEntries(formData));
    startTransition(async () => {
      try {
        const result = await createEvent(formData);
        if ("error" in result) {
          setError(result.error);
        } else if (result.success) {
          setSuccess(result.success);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch {
        setError(
          "Ha ocurrido un error inesperado. Por favor, intente nuevamente.",
        );
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        ref={popoverRef}
        className="w-96 max-w-md rounded-2xl bg-white shadow-lg"
        onClick={handlePopoverClick}
      >
        <div className="mb-2 flex items-center justify-between rounded-2xl bg-slate-100 p-1">
          <HiOutlineMenuAlt4 className="ml-1" />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={handleClose}
          >
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>
        <form className="space-y-4 p-6" action={onSubmit}>
          <div>
            <Input
              type="text"
              name="title"
              placeholder="Título del evento"
              className="my-2 rounded-none border-0 border-b text-lg focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex items-center justify-between">
            {/* <div className="w-auto px-4 py-2 text-blue-700 text-lg">
              Reserva de local
            </div> */}
          </div>

          <div className="flex items-center space-x-3">
            <MdOutlineMeetingRoom className="size-5 text-slate-600" />
            <select
              id="rooms"
              name="room"
              value={selectedRoom}
              onChange={(e) => setRoom(e.target.value)}
              className="w-72 pl-4 py-2 text-sm rounded-lg border-0 bg-slate-100 text-gray-500 placeholder:text-slate-600 placeholder:text-sm"
            >
              <option value="">Elija un salón</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <FiClock className="size-5 text-gray-600" />
            <div className="flex items-center space-x-3 text-sm">
              <p>{capitalizeFirstLetter(
                    dayjs(date).locale(es).format("dddd, MMMM D")
                )}  
              </p>
              <AddTime onTimeSelect={setSelectedTime} />
              <input type="hidden" name="date" value={date} />
              <input type="hidden" name="time" value={selectedTime} />
              <AddEndTime onTimeSelect={setSelectedEndTime} />
              <input type="hidden" name="date" value={date} />
              <input type="hidden" name="time" value={selectedEndTime} />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MdOutlineClass className="size-5 text-slate-600" />
            <select
              id="courses"
              name="course"
              value={selectedCourse}
              onChange={(e) => setCourse(e.target.value)}
              className="w-72 pl-4 py-2 text-sm rounded-lg border-0 bg-slate-100 text-gray-500 placeholder:text-slate-600"
            >
              <option value="">Elija un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <MdOutlineCategory className="size-5 text-slate-600" />
            <select
              id="reservationtype"
              name="reservationtype"
              value={selectedReservationType}
              onChange={(e) => setReservationType(e.target.value)}
              className="w-72 pl-4 py-2 text-sm rounded-lg border-0 bg-slate-100 text-gray-500 placeholder:text-slate-600"
            >
              <option value="">Elija tipo de reserva</option>
              {reservationTypes.map((restype) => (
                <option key={restype.id} value={restype.id}>
                  {restype.name}
                </option>
              ))}
            </select>
          </div>

         <div className="flex items-start space-x-3">
            <MdNotes  className="size-5 text-slate-600" />  
            <Textarea
              name="description"
              placeholder="Adicione breve descripción"
              className="w-72 rounded-none border-0 border-b text-xs focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex items-center space-x-3">
            <HiOutlineUser className="size-5 text-slate-600" />
            <div className="">
              <div className="flex items-center space-x-3 text-sm">
                {" "}
                <p>Invitado</p>{" "}
                <div className="h-4 w-4 rounded-full bg-violet-500"></div>{" "}
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span>Ocupado</span>
                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                <span>Visibilidad pública</span>{" "}
                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                <span>No notificar</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isPending} className="w-auto rounded-2xl">
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
          {error && <p className="mt-2 px-6 text-red-500">{error}</p>}
          {success && (
            <p className="mt-2 px-6 text-green-500">Reserva exitosa</p>
          )}
        </form>
      </div>
    </div>
  );
}
