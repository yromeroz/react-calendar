import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { 
  salonTable, 
  materiaTable, 
  tipoReservaTable,
  reservaTable,
  reservaSalonesTable,
} from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { 
  CalendarEventType,
  RoomFilterType,
  SubjectFilterType,
  ReservationFilterType,
 } from "@/lib/store";
import dayjs from "dayjs";

const getEventsData = async () => {
  try {
    const reservas = await db
      .select({
        id: reservaTable.id,
        name: reservaTable.name,
        date: reservaTable.time,
        endTime: reservaTable.endTime,
        description: reservaTable.description,
        courseId: reservaTable.courseId,
        state: reservaTable.state,
        authRequired: reservaTable.authRequired,
        createdAt: reservaTable.createdAt,
        manager: reservaTable.manager,
        authorization: reservaTable.authorization,
        managerLogin: reservaTable.managerLogin,
        subjectId: reservaTable.subjectId,
        typeId: reservaTable.typeId,
        rooms: sql<string>`group_concat(${reservaSalonesTable.salonId})`,
        color: reservaTable.color
      })
      .from(reservaTable)
      .innerJoin(reservaSalonesTable, eq(reservaSalonesTable.reservaId, reservaTable.id))
      .where(eq(reservaTable.state, 1))
      .groupBy(reservaTable.id);
    return reservas.map((reserva) => ({
      id: Number(reserva.id),
      name: reserva.name,
      date: dayjs(reserva.date).toISOString(),
      endTime: dayjs(reserva.endTime).toISOString(),
      courseId: Number(reserva.courseId),
      state: Number(reserva.state),
      description: reserva.description,
      rooms: typeof reserva.rooms === "string" && reserva.rooms.length > 0 
        ? reserva.rooms.split(",").map(Number) 
        : [],
      subject: Number(reserva.subjectId),
      reservationType: Number(reserva.typeId),
      authRequired: Boolean(reserva.authRequired),
      manager: reserva.manager,
      authorization: reserva.authorization,
      managerLogin: reserva.managerLogin,
      color: reserva.color,      
    }));
  } catch (error) {
    console.error("Error cargando la información de la BD: ", error);
    return [];
  }
};

const getFiltersData = async () => {
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

export default async function Home() {
  const dbEvents = await getEventsData();
  const dbFilters = await getFiltersData();

  return (
    <div className="">
      <Header />
      <MainView 
        eventsData={dbEvents as unknown as CalendarEventType[]} 
        filtersData={dbFilters as unknown as { 
          roomFilters: RoomFilterType[]; 
          subjectFilters: SubjectFilterType[];
          resTypeFilters: ReservationFilterType[] 
        }}
      />
      <Footer />
    </div>
  );
}
