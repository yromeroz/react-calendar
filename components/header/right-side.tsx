"use client";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useViewStore } from "@/lib/store";

export default function HeaderRight() {

  const { setView } = useViewStore();

  return (
    <div className="flex items-center space-x-4 pr-4"
    title="Elegir vista del calendario">
    {/* <SearchComponent /> */}
    <Select onValueChange={(v) => setView(v)}>
      <SelectTrigger className="w-[clamp(2.5rem,20vmin,6rem)] h-[clamp(1rem,7vmin,2.5rem)] text-[clamp(0.625rem,2.5vmin,1rem)] border-2 border-gray-300 focus:outline-none rounded-full hover:bg-blue-100 hover:border-blue-500">
        <SelectValue placeholder="Mes" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">Mes</SelectItem>
        <SelectItem value="week">Semana</SelectItem>
        <SelectItem value="day">Día</SelectItem>
      </SelectContent>
    </Select>

    <Avatar title="Usuario">
      <AvatarImage src="/img/user2.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  </div>
  )
}
