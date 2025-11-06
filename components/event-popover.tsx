"use client";

import React, 
{ 
  useRef, 
  useState, 
  useTransition 
} from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { HiOutlineMenuAlt4, HiOutlineUser } from "react-icons/hi";
import {
  MdNotes,
  MdOutlineCategory,
  MdOutlineClass,
} from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import AddTime from "./add-time";
import AddEndTime from "./add-end-time";
import { createEvent } from "@/app/actions/event-actions";
// import { cn } from "@/lib/utils";
import { useFiltersStore } from "@/lib/store";
import { AddEventDate } from "./add-date";
import { useForm } from "react-hook-form";
// import { getUsers } from "@/lib/data";

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

interface FormData {
  requesterName: string;
  requesterEmail: string;
  description: string;
  course: number;
  reservationType: number;
  date: string;
  time: string;
  endTime: string;
  state: number;
}

export default function EventPopover({
  // isOpen,
  onClose,
  date,
}: EventPopoverProps) {
  const initTime = "07:00";
  const endTime = initTime.split(":")[0] + ":30";
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const initialDate = dayjs(date).toDate();
    return isNaN(initialDate.getTime()) ? new Date() : initialDate;
  });
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
  // React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    // setValue,
    watch
   } = useForm<FormData>({
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      description: "",
      reservationType: 1,
      course: 1,
      date: "",
      time: "",
      endTime: "",
      state: 2,
    }
   });
  // Watch name field for changes
  watch("requesterName");
  watch("requesterEmail");

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  async function onSubmit(data: FormData) {
    console.log("Selected date:", selectedDate);
    console.log("Is valid date:", !isNaN(selectedDate.getTime()));
    console.log("Date value:", date); // el prop que recibes    
    
    // Validar que selectedDate sea una fecha válida
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      setError("La fecha seleccionada no es válida.");
      setSuccess(false);
      return;
    }
    
    // Date valdation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
      setError("La fecha de reserva debe ser igual o posterior a la fecha actual.");
      setSuccess(false);
      return; // Stop the form submission
    }
    // Time validation
    const [startHour, startMinute] = selectedTime.split(':').map(Number);
    const [endHour, endMinute] = selectedEndTime.split(':').map(Number);

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    if (endTimeInMinutes <= startTimeInMinutes) {
      setError("La hora de finalización debe ser posterior a la hora de inicio.");
      setSuccess(false);
      return;
    }
    // Clear previous errors
    setError(null);
    setSuccess(null);
    // Validate required fields
    const formData = new FormData();
    formData.append("date", selectedDate.toISOString());
    formData.append("time", selectedTime);
    formData.append("endTime", selectedEndTime);
    formData.append("requesterEmail", data.requesterEmail);
    formData.append("requesterName", data.requesterName);
    formData.append("description", text);
    formData.append("course", selectedCourse);
    formData.append("reservationType", selectedReservationType);
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
        console.error("Error creating event:", error);
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
        <form className="space-y-4 px-6 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <div className="w-auto px-4 text-lg text-gray-700">
              Solicitud de Reserva
            </div>
          </div>

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
                  {/* Add 3 hours to show 'America/Montevideo' timezone */}
                  {!showPicker &&
                    dayjs(selectedDate)
                      .add(3, 'hour')
                      .locale(es)
                      .format(" dddd, MMM D")
                      .replace(/\b[a-záéíóúñ]+\b/gi, (str) => str[0].toUpperCase() + str.slice(1).toLowerCase())
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
                    new Date(`1970-01-01T${selectedTime}:00`).toLocaleTimeString("en-US", {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }
                </a>
                {showTimePicker && !showPicker && (
                  <AddTime 
                    onTimeSelect={setSelectedTime}
                    initialTime={selectedTime} 
                  />
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
                    new Date(`1970-01-01T${selectedEndTime}:00`).toLocaleTimeString("en-US", {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                    }
                </a>
                {showEndTimePicker && !showPicker && (
                  <AddEndTime 
                    onTimeSelect={setSelectedEndTime}
                    initialTime={selectedEndTime} 
                  />
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
            <div className="flex flex-col space-y-3">
              <Input 
                title="Nombre de contacto"
                type="text" 
                placeholder="Escriba su nombre de contacto" 
                className="w-72 rounded-lg border-0 bg-slate-100 py-2 pl-4 text-sm placeholder:text-slate-600 text-gray-500 hover:text-black"
                {...register("requesterName", { 
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres"
                  }
                })}                
              />
              {errors.requesterName && <p className="text-red-500 text-sm">{errors.requesterName.message}</p>}
              <Input 
                title="Correo electrónico"
                type="email" 
                placeholder="Escriba su correo electrónico" 
                className="w-72 rounded-lg border-0 bg-slate-100 py-2 text-sm placeholder:text-slate-600 text-gray-500 hover:text-black"
                {...register("requesterEmail", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}                
              />
              {errors.requesterEmail && <p className="text-red-500 text-sm">{errors.requesterEmail.message}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              title="Guardar solicitud"
              type="submit"
              disabled={isPending}
              className="w-auto rounded-2xl"
            >
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
          {error && <p className="mt-2 px-6 text-red-500">{error}</p>}
          {success && (
            <p className="mt-2 px-6 text-green-500">Solicitud enviada.<br/>Recibirá la confirmación a su correo electrónico.</p>
          )}
        </form>
      </div>
    </div>
  );
}
