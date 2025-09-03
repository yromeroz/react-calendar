import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { 
  eventsTable, 
  salonTable, 
  materiaTable, 
  tipoReservaTable 
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
    const data = await db.select().from(eventsTable);
    // Convert the Dayjs object to a simple ISO string
    return data.map((event) => ({
      ...event,
      date: dayjs(event.date).toISOString(), // Convert Dayjs to string
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
