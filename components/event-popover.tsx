"use client";

import React, 
{ 
  // useEffect, 
  useRef, 
  useState, 
  useTransition 
} from "react";
import { Button } from "./ui/button";
// import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { HiOutlineMenuAlt4, HiOutlineUser } from "react-icons/hi";
import {
  MdNotes,
  MdOutlineCategory,
  MdOutlineClass,
  // MdOutlineMeetingRoom,
} from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import AddTime from "./add-time";
import AddEndTime from "./add-end-time";
import { createEvent } from "@/app/actions/event-actions";
// import { cn } from "@/lib/utils";
import { useFiltersStore } from "@/lib/store";
import { AddEventDate } from "./add-date";
import { getUsers } from "@/lib/data";

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export default function EventPopover({
  // isOpen,
  onClose,
  date,
}: EventPopoverProps) {
  const initTime = "07:00";
  const endTime = initTime.split(":")[0] + ":30";
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(dayjs(date).toDate());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(initTime);
  const [selectedEndTime, setSelectedEndTime] = useState(endTime);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedCourse, setCourse] = useState("");
  const [selectedReservationType, setReservationType] = useState("");
  const { courses, reservationTypes } = useFiltersStore();
  const [text, setText] = useState("");
  const users = getUsers();
  const [loggedInUser, setUserId] = useState("3"); // Default to "Invitado"
  const [showUsers, setShowUsers] = useState(false);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       popoverRef.current &&
  //       !popoverRef.current.contains(event.target as Node)
  //     ) {
  //       const isPopoverContent = (event.target as HTMLElement).closest('[data-radix-popper-content]');
  //       if (!isPopoverContent) {
  //         onClose();
  //       }
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen, onClose]);

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
    formData.append("date", selectedDate.toISOString());
    formData.append("time", selectedTime);
    formData.append("endtime", selectedEndTime);
    formData.append(
      "requesterEmail", 
      users.find((u) => u.id === Number(loggedInUser))?.email ?? ""
    );
    formData.append(
      "requesterName", 
      users.find((u) => u.id === Number(loggedInUser))?.name ?? ""
    );
    formData.append("description", text);
    formData.append("course", selectedCourse);
    formData.append("reservationtype", selectedReservationType);
    formData.append("state", "2"); // Estado "Pendiente"
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
        <div className="mb-2 flex items-center justify-between rounded-2xl bg-slate-200 p-1">
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
        <form className="space-y-4 px-6 py-4" action={onSubmit}>
          {/* <div>
            <Input
              title="Evento"
              type="text"
              name="title"
              placeholder="Título del evento"
              className="my-2 rounded-none border-0 border-b text-lg focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-2 hover:border-blue-600"
            />
          </div> */}
          <div className="flex items-center justify-between">
            <div className="w-auto px-4 text-lg text-gray-700">
              Reserva de salón
            </div>
          </div>

          {/* <div className="flex items-center space-x-3">
            <MdOutlineMeetingRoom className="size-5 text-slate-600" />
            <select
              title="Salón"
              id="rooms"
              name="room"
              value={selectedRoom}
              onChange={(e) => setRoom(e.target.value)}
              className={`w-72 pl-4 py-2 text-sm rounded-lg border-0 bg-slate-100 placeholder:text-slate-600 placeholder:text-sm
                ${selectedRoom === ""
                ? "text-gray-500 hover:text-black"
                : "text-black"}`}
            >
              <option value="">Elija un salón</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="flex items-center space-x-3">
            <FiClock className="size-5 text-gray-600" />
            <div className="flex items-center space-x-3 text-sm">
              {/* Date Picker */}
              
              <div title="Fecha">
                 <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPicker(!showPicker);
                    setShowTimePicker(false);
                    setShowEndTimePicker(false);
                  }}
                  className="hover:text-gray-500 hover:underline"
                >
                  {!showPicker &&
                    dayjs(selectedDate)
                      .locale(es)
                      .format(" dddd, MMM D")
                      .replace(/\b[a-z]/gi, (str) => str[0].toUpperCase() + str.slice(1).toLowerCase())
                    }
                </a>
                {showPicker &&
                 <AddEventDate onDateChange={setSelectedDate}/>}  
              </div>
              {/* Start Time */}
              <div title="Hora de inicio">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTimePicker(!showTimePicker);
                    setShowEndTimePicker(false);
                    setShowPicker(false);
                  }}
                  className="hover:text-gray-500 hover:underline"
                >
                  {!showTimePicker &&
                    "de: " +
                      dayjs(selectedTime,"HH:mm")
                      .format("h:mmA")
                      .toString()
                    }
                </a>
                {showTimePicker && !showPicker && (
                  <AddTime onTimeSelect={setSelectedTime} />
                )}
                <input type="hidden" name="date" value={date} />
                <input type="hidden" name="time" value={selectedTime} />
              </div>
              {/* End Time */}
              <div title="Hora de fin">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEndTimePicker(!showPicker);
                    setShowTimePicker(false);
                    setShowPicker(false);
                  }}
                  className="hover:text-gray-500 hover:underline"
                >
                  {!showEndTimePicker &&
                    " a: " +
                      dayjs(selectedEndTime, "HH:mm")
                      .format("h:mmA")
                      .toString()
                    }
                </a>
                {showEndTimePicker && !showPicker && (
                  <AddEndTime onTimeSelect={setSelectedEndTime} />
                )}
                <input type="hidden" name="endtime" value={selectedEndTime} />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MdOutlineClass className="size-5 text-slate-600" />
            <select
              title="Materia"
              id="courses"
              name="course"
              value={selectedCourse}
              onChange={(e) => (
                setCourse(e.target.value),
                setText(`${text} Materia: ${e.target.value}\n`),
                setShowPicker(false),
                setShowTimePicker(false),
                setShowEndTimePicker(false)                
              )}
              className={`w-72 rounded-lg border-0 bg-slate-100 py-2 pl-4 text-sm placeholder:text-slate-600 ${
                selectedCourse === ""
                  ? "text-gray-500 hover:text-black"
                  : "text-black"
              }`}
            >
              <option value="">Elija una materia</option>
              {courses.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <MdOutlineCategory className="size-5 text-slate-600" />
            <select
              title="Tipo de reserva"
              id="reservationtype"
              name="reservationtype"
              value={selectedReservationType}
              onChange={(e) => (
                setReservationType(e.target.value),
                setText(`${text} Tipo de reserva: ${e.target.value}\n`),
                setShowPicker(false),
                setShowTimePicker(false),
                setShowEndTimePicker(false)
              )}
              className={`w-72 rounded-lg border-0 bg-slate-100 py-2 pl-4 text-sm placeholder:text-slate-600 ${
                selectedReservationType === ""
                  ? "text-gray-500 hover:text-black"
                  : "text-black"
              }`}
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
            <MdNotes className="size-5 text-slate-600" />
            <Textarea
              title="Descripción"
              name="description"
              placeholder="Adicione breve descripción"
              className="w-72 rounded-none border-0 border-b text-xs hover:border-2 hover:border-blue-600 focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></Textarea>
          </div>
          <div className="flex items-center space-x-3">
            <HiOutlineUser className="size-5 text-slate-600" />
            <div className="">
              <div
                title="Perfil de usuario"
                className="flex items-center space-x-3 text-sm"
              >
                <div title="Usuario">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowUsers(!showUsers);
                    }}
                    className="hover:text-gray-500 hover:underline"
                  >
                    {!showUsers && users.find((u) => u.id === Number(loggedInUser))?.name}
                  </a>
                  {showUsers && (
                    <select
                      title="Usuario"
                      id="users"
                      name="user"
                      value={loggedInUser}
                      onChange={(e) => setUserId(e.target.value)}
                      className={`w-32 rounded-lg border-0 bg-slate-100 py-2 pl-4 text-sm placeholder:text-slate-600 ${
                        loggedInUser === ""
                          ? "text-gray-500 hover:text-black"
                          : "text-black"
                      }`}
                    >
                      <option value="">Elija un usuario</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <input type="hidden" name="username" value={users.find((u) => u.id === Number(loggedInUser))?.name} />
                <input type="hidden" name="useremail" value={users.find((u) => u.id === Number(loggedInUser))?.email} />
                <div
                  className={`h-4 w-4 rounded-full ${users.find((u) => u.id === Number(loggedInUser))?.role === "Invitado" ? "bg-orange-500" : "bg-green-500"}`}
                ></div>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span>{`${users.find((u) => u.id === Number(loggedInUser))?.role === "Invitado" ? "Visitante" : users.find((u) => u.id === Number(loggedInUser))?.role}`}</span>
                <div className="h-1 w-1 rounded-full bg-gray-500" />
                <span>{`${users.find((u) => u.id === Number(loggedInUser))?.role === "Invitado" ? "Visibilidad pública" : "Privilegios"}`}</span>
                <div className="h-1 w-1 rounded-full bg-gray-500" />
                <span>{`${users.find((u) => u.id === Number(loggedInUser))?.role === "Invitado" ? "No notificar" : users.find((u) => u.id === Number(loggedInUser))?.email}`}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              title="Guardar evento"
              type="submit"
              disabled={isPending}
              className="w-auto rounded-2xl"
            >
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
