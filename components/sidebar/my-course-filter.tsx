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
  const { setView } = useViewStore();

  const myCourses = [
    { id: "1", name: "Economía" },
    { id: "2", name: "Antropología" },
    { id: "3", name: "Análisis matemático" },
    { id: "4", name: "Administración de empresas" },
    { id: "5", name: "Psicología" },
    { id: "6", name: "Informática" },
  ]

  return (
    <div className="p-1 flex items-center space-x-4">
      {/* <SearchComponent /> */}
      <div>
      <Select onValueChange={(v) => setView(v)}>
        <SelectTrigger className="w-48 h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Cursos" />
        </SelectTrigger>
        <SelectContent>
          {myCourses.map((course) => (
            <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>      
    </div>
    
  );
}
