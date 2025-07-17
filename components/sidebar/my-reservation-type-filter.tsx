"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getReservationTypes } from "@/lib/data";
export default function MyResTypeFilter() {
  const resTypes = getReservationTypes();

  return (
    <div className="p-1 flex items-center space-x-4">
      {/* <SearchComponent /> */}
      <Select>
        <SelectTrigger className="w-48 h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Tipo de Reserva" />
        </SelectTrigger>
        <SelectContent>
          {resTypes.map((restype) => (
            <SelectItem key={restype.id} value={restype.name}>{restype.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    
  );
}
