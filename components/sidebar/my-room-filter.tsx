"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useViewStore } from "@/lib/store";
export default function MyFilters() {

  // const { setView } = useViewStore();
  
  const myRooms = [
    { id: "1", name: "Salón 1" },
    { id: "2", name: "Salón 2" },
    { id: "3", name: "Salón 3" },
    { id: "4", name: "Salón 4" },
    { id: "5", name: "Salón 5" },
    { id: "6", name: "Salón 6" },
  ]

  return (
    <div className="mt-6 p-1 flex items-center space-x-4">
      {/* <Select onValueChange={(v) => setView(v)}> */}
      <Select>
        <SelectTrigger className="w-48 h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Salones" />
        </SelectTrigger>
        <SelectContent>
          {myRooms.map((room) => (
            <SelectItem key={room.id} value={room.name}>{room.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>     
    </div>
    
  );
}
