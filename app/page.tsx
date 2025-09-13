import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { 
  salonTable, 
  materiaTable, 
  tipoReservaTable, 
} from "@/db/schema";
import { 
  CalendarEventType,
  RoomFilterType,
  SubjectFilterType,
  ReservationFilterType,
 } from "@/lib/store";
import dayjs from "dayjs";

const getEventsData = async () => {
  try {
    const reservas = await db.query.reservaTable.findMany({
      with: {
        reservaSalones: true, 
      },
    });
    return reservas.map((reserva) => ({
      id: Number(reserva.id),
      title: `Reserva ${reserva.id}`,
      date: dayjs(reserva.time).toISOString(),
      endTime: dayjs(reserva.endTime).toISOString(),
      courseId: Number(reserva.courseId),
      groupId: Number(reserva.groupId),
      frequency: Number(reserva.frequency),
      state: Number(reserva.state),
      isReplicable: Boolean(reserva.isReplicable),
      description: reserva.description,
      rooms: reserva.reservaSalones.map((rs) => Number(rs.salonId)),
      subject: Number(reserva.subjectId),
      reservationType: Number(reserva.typeId),
      authRequired: Boolean(reserva.authRequired),
      createdAt: dayjs(reserva.createdAt).toISOString(),
      manager: reserva.manager,
      authorization: reserva.authorization,
      managerLogin: reserva.managerLogin,      
    }));
  } catch (error) {
    console.error("Error cargando la información de la BD: ", error);
    return [];
  }
};

const getFiltersData = async () => {
  try {
    const allRooms  = await db.select().from(salonTable);
    const rooms: RoomFilterType[] = allRooms.map((room) => ({
      id: Number(room.id),
      name: room.description,
      shortname: room.name,
    }));

    const allSubjects = await db.select().from(materiaTable);
    const subjects: SubjectFilterType[] = allSubjects.map((subject) => ({
      id: Number(subject.id),
      name: subject.name,
    }));

    const allReservationTypes = await db.select().from(tipoReservaTable);
    const reservationTypes: ReservationFilterType[] = allReservationTypes.map((rtype) => ({
      id: Number(rtype.id),
      name: rtype.name,
      color: rtype.color,
    }));

    return {
      rooms,
      subjects,
      reservationTypes,
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
          rooms: RoomFilterType[]; 
          subjects: SubjectFilterType[];
          reservationTypes: ReservationFilterType[] 
        }}
      />
      <Footer />
    </div>
  );
}
