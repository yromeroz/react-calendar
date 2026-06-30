import { db } from "@/db/drizzle";
import {
  salonTable,
  materiaTable,
  tipoReservaTable,
  reservaTable,
  reservaSalonesTable,
  parametrosTable,
} from "@/db/schema";
import { sql, eq, gte, and, asc } from "drizzle-orm";
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

export const getEventsData = async (
  since: string,
): Promise<CalendarEventType[]> => {
  try {
    const sinceDate = since ? dayjs(since).toDate() : new Date(0); // Si 'since' es vacío, usar la fecha mínima
    const reservas = await db
      .select({
        id: reservaTable.id,
        name: reservaTable.name,
        // Usar DATE_FORMAT para obtener strings en UTC sin conversión accidental
        dateStr: sql<string>`DATE_FORMAT(${reservaTable.time}, '%Y-%m-%dT%H:%i:%s')`,
        endTimeStr: sql<string>`DATE_FORMAT(${reservaTable.endTime}, '%Y-%m-%dT%H:%i:%s')`,
        description: reservaTable.description,
        groupId: reservaTable.groupId,
        state: reservaTable.state,
        authRequired: reservaTable.authRequired,
        createdAtStr: sql<string>`DATE_FORMAT(${reservaTable.createdAt}, '%Y-%m-%dT%H:%i:%s')`,
        manager: reservaTable.manager,
        authorization: reservaTable.authorization,
        managerLogin: reservaTable.managerLogin,
        subjectId: reservaTable.subjectId,
        typeId: reservaTable.typeId,
        rooms: sql<string>`group_concat(${reservaSalonesTable.salonId})`,
        color: reservaTable.color,
      })
      .from(reservaTable)
      .innerJoin(
        reservaSalonesTable,
        eq(reservaSalonesTable.reservaId, reservaTable.id),
      )
      .where(
        and(eq(reservaTable.state, 1), gte(reservaTable.createdAt, sinceDate)),
      ) // Solo reservas activas y creadas después de 'since' (o todas si 'since' es "")
      .groupBy(reservaTable.id);

    return reservas.map((r) => ({
      id: Number(r.id),
      name: r.name,
      // Parsea strings directamente, sin conversión de Date (evita ambigüedad de timezone)
      date: dayjs(r.dateStr),
      endTime: dayjs(r.endTimeStr),
      description: r.description,
      groupId: Number(r.groupId),
      state: Number(r.state),
      rooms:
        typeof r.rooms === "string" && r.rooms.length > 0
          ? r.rooms.split(",")
          : [],
      subject: r.subjectId,
      reservationType: Number(r.typeId),
      createdAt: dayjs(r.createdAtStr),
      authRequired: Boolean(r.authRequired),
      manager: r.manager,
      authorization: r.authorization,
      managerLogin: r.managerLogin,
      color: r.color || "#98b8ff",
    }));
  } catch (error) {
    console.error("Error cargando la información de la BD: ", error);
    return [];
  }
};

export const getLastCreatedAt = async (): Promise<string> => {
  try {
    const result = await db
      .select({
        max: sql<string>`DATE_FORMAT(MAX(${reservaTable.createdAt}), '%Y-%m-%dT%H:%i:%s')`,
      })
      .from(reservaTable)
      .where(eq(reservaTable.state, 1))
      .limit(1);
    const lastCreatedAtStr = result[0].max;
    return result.length > 0 && lastCreatedAtStr
      ? dayjs(lastCreatedAtStr).toISOString()
      : dayjs(new Date(0)).toISOString();
  } catch (error) {
    console.error("Error obteniendo la última fecha de actualización: ", error);
    return "";
  }
};

export const getFiltersData = async () => {
  try {
    const allRooms = await db.select().from(salonTable);
    const roomFilters: RoomFilterType[] = allRooms.map((room) => ({
      id: room.id,
      name: room.description,
      shortname: room.name,
    }));

    const allSubjects = await db.select().from(materiaTable).orderBy(asc(materiaTable.name));
    const subjectFilters: SubjectFilterType[] = allSubjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
    }));

    const allReservationTypes = await db.select().from(tipoReservaTable);
    const resTypeFilters: ReservationFilterType[] = allReservationTypes.map(
      (rt) => ({
        id: Number(rt.id),
        name: rt.name,
        color: rt.color,
      }),
    );

    return {
      roomFilters,
      subjectFilters,
      resTypeFilters,
    };
  } catch (error) {
    console.error("Error cargando los filtros de la BD: ", error);
    return { roomFilters: [], subjectFilters: [], resTypeFilters: [] };
  }
};

export const getCarrerasData = async (): Promise<
  { id: number; name: string; color: string }[]
> => {
  try {
    const { db } = await import("@/db/drizzle");
    const { carreraTable } = await import("@/db/schema");
    const allCarreras = await db.select().from(carreraTable);
    return allCarreras.map((carrera) => ({
      id: Number(carrera.id),
      name: carrera.name,
      color: carrera.color,
    }));
  } catch (error) {
    console.error("Error cargando las carreras de la BD: ", error);
    return [];
  }
};


