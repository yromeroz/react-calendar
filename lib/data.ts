import { db } from "@/db/drizzle";
import { 
  salonTable, 
  materiaTable, 
  tipoReservaTable,
  reservaTable,
  reservaSalonesTable,
  parametrosTable,
} from "@/db/schema";
import { sql, eq, gt, and } from "drizzle-orm";
import { 
  CalendarEventType,
  RoomFilterType,
  SubjectFilterType,
  ReservationFilterType,
 } from "@/lib/store";
import dayjs from "dayjs";

export const getReservaUrlData = async (): Promise<string> => {
  try {
    const paramUrl = await db
      .select({
        url: parametrosTable.paramsReservaUrl,
      })
      .from(parametrosTable)
      .limit(1);
    return paramUrl[0].url;
  } catch (error) {
    console.error("Error cargando la información de la BD: ", error);
    return "";
  }
};

export const getEventsData = async (since: string): Promise<CalendarEventType[]> => {
  try {
    const reservas = await db
      .select({
        id: reservaTable.id,
        name: reservaTable.name,
        // Use DB-side formatting to get wall-clock datetime strings (no JS Date conversion)
        // dateStr: sql`DATE_FORMAT(${reservaTable.time}, '%Y-%m-%dT%H:%i:%s')`,
        // endTimeStr: sql`DATE_FORMAT(${reservaTable.endTime}, '%Y-%m-%dT%H:%i:%s')`,
        date: reservaTable.time,
        endTime: reservaTable.endTime, 
        description: reservaTable.description,
        courseId: reservaTable.courseId,
        groupId: reservaTable.groupId,
        state: reservaTable.state,
        authRequired: reservaTable.authRequired,
        createdAt: reservaTable.createdAt,
        manager: reservaTable.manager,
        authorization: reservaTable.authorization,
        managerLogin: reservaTable.managerLogin,
        subjectId: reservaTable.subjectId,
        typeId: reservaTable.typeId,
        rooms: sql<string>`group_concat(${reservaSalonesTable.salonId})`,
        color: reservaTable.color,
      })
      .from(reservaTable)
      .innerJoin(reservaSalonesTable, eq(reservaSalonesTable.reservaId, reservaTable.id))
      .where(and(
        eq(reservaTable.state, 1), 
        gt(reservaTable.createdAt, since !== "" ? new Date(since) : new Date(0)))) // Solo reservas activas y creadas después de 'since' (o todas si 'since' es "")
      .groupBy(reservaTable.id);    

    return reservas.map((r) => ({
      ...r,
      id: Number(r.id),
      date: dayjs(r.date),
      endTime: dayjs(r.endTime),
      courseId: Number(r.courseId),
      groupId: Number(r.groupId),
      state: Number(r.state),
      rooms: typeof r.rooms === "string" && r.rooms.length > 0 
        ? r.rooms.split(",").map(Number) 
        : [],
      subject: Number(r.subjectId),
      reservationType: Number(r.typeId),
      createdAt: dayjs(r.createdAt),
      authRequired: Boolean(r.authRequired),
    }));
  } catch (error) {
    console.error("Error cargando la información de la BD: ", error);
    return [];
  }
};

export const getLastCreatedAt = async (): Promise<string> => {
  try {
    const result = await db
      .select({ max: sql`MAX(${reservaTable.createdAt})` })
      .from(reservaTable)
      .where(eq(reservaTable.state, 1)) 
      .limit(1);
    const lastCreatedAt = result[0].max;  
    return (result.length > 0 && lastCreatedAt instanceof Date) 
      ? new Date(lastCreatedAt).toISOString() 
      : new Date(0).toISOString();
  } catch (error) {
    console.error("Error obteniendo la última fecha de actualización: ", error);
    return "";
  } 
};

export const getFiltersData = async () => {
  try {
    const allRooms  = await db.select().from(salonTable);
    const roomFilters: RoomFilterType[] = allRooms.map((room) => ({
      id: Number(room.id),
      name: room.description,
      shortname: room.name,
    }));

    const allSubjects = await db.select().from(materiaTable);
    const subjectFilters: SubjectFilterType[] = allSubjects.map((subject) => ({
      id: Number(subject.id),
      name: subject.name,
    }));

    const allReservationTypes = await db.select().from(tipoReservaTable);
    const resTypeFilters: ReservationFilterType[] = allReservationTypes.map((rt) => ({
      id: Number(rt.id),
      name: rt.name,
      color: rt.color,
    }));

    return {
      roomFilters,
      subjectFilters,
      resTypeFilters,
    };
  } catch (error) {
    console.error("Error cargando los filtros de la BD: ", error);
    return { rooms: [], subjects: [], reservationTypes: [] };
  }
};

// Dummy data
export const users = [
  {id: 1, name: "Ana", email: "anarojas@outlook.com", role: "Coordinador", color: "blue", avatar: "manager"},
  {id: 2, name: "Alvaro", email: "alvaro@outlook.com", role: "Profesor", color: "green", avatar: "teacher"},
  {id: 3, name: "Invitado", email: "", role: "Invitado", color: "gray", avatar: "guest"},
  {id: 4, name: "Silvana", email: "silvana@hotmail.com", role: "Sysadmin", color: "violet", avatar: "sysadmin"},
]

export const getUsers = () => users;