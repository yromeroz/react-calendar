import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getMonth } from "./getTime";

interface ViewStoreType {
  selectedView: string;
  setView: (value: string) => void;
}

interface DateStoreType {
  userSelectedDate: Dayjs;
  setDate: (value: Dayjs) => void;
  twoDMonthArray: dayjs.Dayjs[][];
  selectedMonthIndex: number;
  setMonth: (index: number) => void;
  twoDMonthSidebarArray: dayjs.Dayjs[][];
  sidebarMonthIndex: number;
  setSidebarMonth: (index: number) => void;
  sidebarViewDate: Dayjs;
  setSidebarDate: (date: Dayjs) => void;
}

export type RoomFilterType = { id: number; name: string, shortname: string };
export type SubjectFilterType = { id: number; name: string };
export type ReservationFilterType = { id: number; name: string, color: string };

type FilterStore = {
  rooms: RoomFilterType[];
  courses: SubjectFilterType[];
  reservationTypes: ReservationFilterType[];
  setRooms: (rooms: RoomFilterType[]) => void;
  setCourses: (courses: SubjectFilterType[]) => void;
  setReservationTypes: (reservationTypes: ReservationFilterType[]) => void;
};

export type CalendarEventType = {
  id: number;
  title: string;
  date: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  description: string;
  courseId: number;
  groupId: number;
  frequency: number;
  state: number;
  isReplicable: boolean;
  rooms: number[];
  subject: number;
  reservationType: number;
  createdAt: dayjs.Dayjs;
  manager: string;
  authorization: string;
  managerLogin: string;
  authRequired: boolean;  
};

type EventStore = {
  events: CalendarEventType[];
  unfilteredEvents: CalendarEventType[];
  isPopoverOpen: boolean;
  isPopmenuOpen: boolean;
  isEventSummaryOpen: boolean;
  selectedEvent: CalendarEventType | null;
  setEvents: (events: CalendarEventType[]) => void;
  setUnfilteredEvents: (events: CalendarEventType[]) => void;
  openPopover: () => void;
  closePopover: () => void;
  openEventSummary: (event: CalendarEventType) => void;
  closeEventSummary: () => void;
};

interface ToggleSideBarType {
  isSideBarOpen: boolean;
  setSideBarOpen: () => void;
}

interface PaginateDirectionType {
  direction: number;
  setDirection: (direction: number) => void;
}  

export const useViewStore = create<ViewStoreType>()(
  devtools(
    persist(
      (set) => ({
        selectedView: "month",
        setView: (value: string) => {
          set({ selectedView: value });
        },
      }),
      { name: "calendar_view", skipHydration: true },
    ),
  ),
);

export const useDateStore = create<DateStoreType>()(
  devtools(
    persist(
      (set) => ({
        userSelectedDate: dayjs(),
        twoDMonthArray: getMonth(),
        selectedMonthIndex: dayjs().month(),
        sidebarViewDate: dayjs(),        
        twoDMonthSidebarArray: getMonth(),
        sidebarMonthIndex: dayjs().month(),                
        setDate: (value: Dayjs) => {
          set({ userSelectedDate: value });
        },
        setSidebarDate: (value: Dayjs) => {
          set({ sidebarViewDate: value });
        },        
        setMonth: (index) => {
          set({ twoDMonthArray: getMonth(index), selectedMonthIndex: index });
        },
        setSidebarMonth: (idx) => {
          set({ twoDMonthSidebarArray: getMonth(idx), sidebarMonthIndex: idx });
        },
      }),
      { name: "date_data", skipHydration: true },
    ),
  ),
);

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  unfilteredEvents: [],
  isPopoverOpen: false,
  isEventSummaryOpen: false,
  isPopmenuOpen: false,
  selectedEvent: null,
  setEvents: (events) => set({ events }),
  setUnfilteredEvents: (events) => set({ unfilteredEvents: events }),
  openPopover: () => set({ isPopoverOpen: true }),
  closePopover: () => set({ isPopoverOpen: false }),
  openPopmenu: () => set({ isPopmenuOpen: true }),
  closePopmenu: () => set({ isPopmenuOpen: false }),
  openEventSummary: (event) =>
    set({ isEventSummaryOpen: true, selectedEvent: event }),
  closeEventSummary: () =>
    set({ isEventSummaryOpen: false, selectedEvent: null }),
}));

export const useToggleSideBarStore = create<ToggleSideBarType>()(
  (set, get) => ({
    isSideBarOpen: true,
    setSideBarOpen: () => {
      set({ isSideBarOpen: !get().isSideBarOpen });
    },
  }),
);

export const usePaginateDirectionStore = create<PaginateDirectionType>()(
  (set) => ({
    direction: 0,
    setDirection: (direction: number) => {
      set({ direction });
    },
  }),
);

export const useFiltersStore = create<FilterStore>((set) => ({
  rooms: [],
  courses: [],
  reservationTypes: [],
  setRooms: (rooms) => set({ rooms }),
  setCourses: (courses) => set({ courses }),
  setReservationTypes: (reservationTypes) => set({ reservationTypes }),
}));
