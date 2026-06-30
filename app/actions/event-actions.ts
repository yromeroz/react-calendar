'use server'

import { db } from "@/db/drizzle";
import { solicitudReservaTable } from "@/db/schema";
import { revalidatePath } from "next/cache";


export async function createEvent(formData:  FormData): Promise<{ error: string } | { success: boolean } > {
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const endTime = formData.get('endTime') as string;
  const state = 2;
  const requesterEmail = formData.get('requesterEmail') as string;
  const requesterName = formData.get('requesterName') as string;
  const description = formData.get('description') as string;
  const typeId = BigInt(formData.get('reservationType') as string);

  if (!date || !time || !endTime || !state || !requesterEmail || !requesterName || !description) {
    return { error: 'Todos los campos son requeridos' };
  }

  try {
    // Validar y crear las fechas de manera segura
    // Accept plain 'YYYY-MM-DD' date strings (local wall-clock) or full ISO strings
    let eventDate: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, d] = date.split('-').map(Number);
      // Construct local Date at midnight in server timezone to preserve wall-clock date
      eventDate = new Date(y, m - 1, d);
    } else {
      eventDate = new Date(date);
    }

    if (isNaN(eventDate.getTime())) {
      return { error: 'Fecha inválida' };
    }

    // Crear fechas combinadas de manera segura
    const [hours, minutes] = time.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    // Validar que las fechas combinadas sean válidas
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return { error: 'Hora de inicio o fin inválida' };
    }

    await db.insert(solicitudReservaTable).values({
        date: eventDate,
        time: startDateTime,
        endTime: endDateTime,        
        state,
        requesterEmail,
        requesterName,
        description,
        typeId,
      });

      // Revalidate the path and return a success response
    revalidatePath("/");

    return { success: true };  // Return success instead of revalidatePath directly
    
  } catch (error) {
    console.error('Error de creación del evento:', error);
    return { error: 'Falló la creación del evento' };
  }
}