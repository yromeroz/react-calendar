import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MainView from "@/components/MainView";
import { 
  // getEventsData, 
  getFiltersData, 
  getReservaUrlData, 
} from "@/lib/data";
import { 
  CalendarEventType,
  RoomFilterType,
  SubjectFilterType,
  ReservationFilterType,
 } from "@/lib/store";
import PostMessageAuthClient from "@/components/auth/PostMessageAuth";

export default async function Home() {  

  // const dbEvents = await getEventsData("");
  const dbFilters = await getFiltersData();
  const genexusReservasUrl = await getReservaUrlData();

  return (
    <div className="">
      <PostMessageAuthClient />
      <Header />
      <MainView 
        // eventsData={dbEvents as CalendarEventType[]}
        filtersData={dbFilters as { 
          roomFilters: RoomFilterType[]; 
          subjectFilters: SubjectFilterType[];
          resTypeFilters: ReservationFilterType[] 
        }}
        reservasUrl={genexusReservasUrl}
      />
      <Footer />
    </div>
  );
}
