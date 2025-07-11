"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function MyResTypeFilter() {

  const myResTypes = [
    { id: "1", name: "Reunión" },
    { id: "2", name: "Examen" },
    { id: "3", name: "Conferencia" },
    { id: "4", name: "Seminario" },
    { id: "5", name: "Taller" },
    { id: "6", name: "Otro evento" },
  ]


  return (
    <div className="p-1 flex items-center space-x-4">
      {/* <SearchComponent /> */}
      <Select>
        <SelectTrigger className="w-48 h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Tipo de Reserva" />
        </SelectTrigger>
        <SelectContent>
          {myResTypes.map((restype) => (
            <SelectItem key={restype.id} value={restype.name}>{restype.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    
  );
}
