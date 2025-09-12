"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore, useFiltersStore } from "@/lib/store";
export default function MyFilters() {
  const { setEvents, unfilteredEvents }  = useEventStore();
  const { rooms, courses, reservationTypes } = useFiltersStore();
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [reservationFilter, setReservationFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = unfilteredEvents;
  
    if (roomFilter !== "all") {
      filtered = filtered.filter(event => event.room === parseInt(roomFilter));
    }
  
    if (courseFilter !== "all") {
      filtered = filtered.filter(event => event.subject === parseInt(courseFilter));
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
      <Select 
        value={roomFilter}
        onValueChange={(roomId) => setRoomFilter(roomId)}>    
        <SelectTrigger 
          className={`w-80 h-10 lg:w-48 border-2 focus:outline-none rounded-full hover:bg-blue-100 ${
            roomFilter == "all"
            ? "border-gray-300 text-gray-500 hover:border-blue-500 hover:text-black"
            : "border-blue-500 text-black"}`}>
          <SelectValue placeholder="Salones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Salones</SelectItem>
          {rooms && rooms.map((room) => (
            <SelectItem key={room.id} value={room.id.toString()}>{room.shortname}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="p-1 flex items-center space-x-4"
    title="Filtrar por curso">
    <div>
      <Select
        value={courseFilter} 
        onValueChange={(courseId) => setCourseFilter(courseId)}>
        <SelectTrigger className={`w-80 h-10 lg:w-48 border-2 focus:outline-none rounded-full hover:bg-blue-100 ${
            courseFilter == "all"
            ? "border-gray-300 text-gray-500 hover:border-blue-500 hover:text-black"
            : "border-blue-500 text-black"}`}>
          <SelectValue placeholder="Cursos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Cursos</SelectItem>  
          {courses && courses.map((course) => (
            <SelectItem className="text-black" key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>      
    </div>
    <div className="p-1 flex items-center space-x-4"
    title="Filtrar por tipo de reserva">
      <Select
        value={reservationFilter} 
        onValueChange={(resTypeId) => setReservationFilter(resTypeId)}>
        <SelectTrigger className={`w-80 h-10 lg:w-48 border-2 focus:outline-none rounded-full hover:bg-blue-100 ${
            reservationFilter == "all"
            ? "border-gray-300 text-gray-500 hover:border-blue-500 hover:text-black"
            : "border-blue-500 text-black"}`}>
          <SelectValue placeholder="Tipo de Reserva" />
        </SelectTrigger>
        <SelectContent>
           <SelectItem value="all">Tipo de reserva</SelectItem> 
          {reservationTypes && reservationTypes.map((resType) => (
            <SelectItem key={resType.id} value={resType.id.toString()}>{resType.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>        
  </>  
  );
}
