"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCourses } from "@/lib/data";

export default function MyFilters() {

  const courses = getCourses();

  return (
    <div className="p-1 flex items-center space-x-4">
      {/* <SearchComponent /> */}
      <div>
      <Select>
        <SelectTrigger className="w-48 h-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full text-gray-500">
          <SelectValue placeholder="Cursos" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>      
    </div>
    
  );
}
