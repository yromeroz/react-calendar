"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRooms} from "@/lib/data";
export default function MyFilters() {
  const rooms = getRooms();

  return (
    <div className="mt-6 p-1 flex items-center space-x-4">
      {/* <Select onValueChange={(v) => setView(v)}> */}
      <Select>
        <SelectTrigger className="w-48 h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Salones" />
        </SelectTrigger>
        <SelectContent>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.name}>{room.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>     
    </div>
    
  );
}
