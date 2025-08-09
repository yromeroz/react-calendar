"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
    getRooms,
    getCourses,
    getReservationTypes,
} from "@/lib/data";
import { useEventStore } from "@/lib/store";
export default function MyFilters() {
  const rooms = getRooms();
  const courses = getCourses();
  const resTypes = getReservationTypes();
  const { setEvents, unfilteredEvents }  = useEventStore();
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [reservationFilter, setReservationFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = unfilteredEvents;
  
    if (roomFilter !== "all") {
      filtered = filtered.filter(event => event.room === parseInt(roomFilter));
    }
  
    if (courseFilter !== "all") {
      filtered = filtered.filter(event => event.course === parseInt(courseFilter));
    }
  
    if (reservationFilter !== "all") {
      filtered = filtered.filter(event => event.reservationType === parseInt(reservationFilter));
    }
  
    setEvents(filtered);
  }, [roomFilter, courseFilter, reservationFilter, unfilteredEvents, setEvents]);

   return (
    <>
    <div className="mt-6 p-1 flex items-center space-x-4"
      title="Filtrar por salón">
{/*  */}
      <Select onValueChange={(roomId) => setRoomFilter(roomId)}>    
        <SelectTrigger className="w-80 h-10 lg:w-48 lg:h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Salones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Salones</SelectItem>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.id.toString()}>{room.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="p-1 flex items-center space-x-4"
    title="Filtrar por curso">
    <div>
      <Select onValueChange={(courseId) => setCourseFilter(courseId)}>
        <SelectTrigger className="w-80 h-10 lg:w-48 lg:h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Cursos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Cursos</SelectItem>  
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>      
    </div>
    <div className="p-1 flex items-center space-x-4"
    title="Filtrar por tipo de reserva">
      <Select onValueChange={(resTypeId) => setReservationFilter(resTypeId)}>
        <SelectTrigger className="w-80 h-10 lg:w-48 lg:h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Tipo de Reserva" />
        </SelectTrigger>
        <SelectContent>
           <SelectItem value="all">Tipo de reserva</SelectItem> 
          {resTypes.map((resType) => (
            <SelectItem key={resType.id} value={resType.id.toString()}>{resType.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>        
  </>  
  );
}
