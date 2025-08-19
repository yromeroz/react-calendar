'use server'

import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";


export async function createEvent(formData:  FormData): Promise<{ error: string } | { success: boolean } > {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const room = parseInt(formData.get('room') as string);
  const course = parseInt(formData.get('course') as string);
  const reservationType = parseInt(formData.get('reservationtype') as string);
  const endTime = formData.get('endtime') as string;

  if (!title || !description || !date || !time || !room || !course || !reservationType || !endTime) {
    return { error: 'Todos los campos son requeridos' };
  }

  const dateTime = new Date(`${date}T${time}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  try {
    await db.insert(eventsTable).values({
        title,
        description,
        date: dateTime,
        room,
        course,
        reservationType,
        endTime: endDateTime,
      });

      // Revalidate the path and return a success response
    revalidatePath("/");

    return { success: true };  // Return success instead of revalidatePath directly
    
  } catch (error) {
    console.error('Error de creación del evento:', error);
    return { error: 'Falló la creación del evento' };
  }
}