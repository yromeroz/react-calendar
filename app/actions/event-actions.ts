'use server'

import { db } from "@/db/drizzle";
import { solicitudReservaTable } from "@/db/schema";
import { revalidatePath } from "next/cache";


export async function createEvent(formData:  FormData): Promise<{ error: string } | { success: boolean } > {
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const endTime = formData.get('endtime') as string;
  const state = 2;
  const requesterEmail = formData.get('useremail') as string;
  const requesterName = formData.get('username') as string;
  const description = formData.get('description') as string;
  const typeId = BigInt(formData.get('reservationtype') as string);

  if (!date || !time || !endTime || !state || !requesterEmail || !requesterName || !description) {
    if (!requesterEmail && requesterName === "Invitado")
      return { error: 'El usuario Invitado no puede solicitar reservas' };
    
    return { error: 'Todos los campos son requeridos' };
  }

  try {
    await db.insert(solicitudReservaTable).values({
        date: new Date(date),
        time: new Date(`${date}T${time}:00`),
        endTime: new Date(`${date}T${endTime}:00`),
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