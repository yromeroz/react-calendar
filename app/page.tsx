import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/schema"; // Make sure this path matches your schema file
import { CalendarEventType } from "@/lib/store";
import dayjs from "dayjs";

const getEventsData = async () => {
  try {
    const data = await db.select().from(eventsTable);
    // const data = await db.query.eventsTable.findMany();

    // Convert the Dayjs object to a simple ISO string
    return data.map((event) => ({
      ...event,
      date: dayjs(event.date).toISOString(), // Convert Dayjs to string
    }));
  } catch (error) {
    console.error("Error cargando la información de la base de datos:", error);
    return [];
  }
};

export default async function Home() {
  const dbEvents = await getEventsData();

  return (
    <div className="">
      <Header />
      <MainView eventsData={dbEvents as unknown as CalendarEventType[]} />
      <Footer />
    </div>
  );
}
