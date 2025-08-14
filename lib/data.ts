import dayjs from "dayjs";


// Dummy event data for demonstration
export const monthEvents = [
    {id: "ascx34", date: dayjs(), title: "Reunión con el equipo", description: "Reunión de coordinación" },
    {id: "ascx35", date: dayjs().hour(10), title: "Revisión de código", description: "Reunión para revisar el código"  },
    {id: "ascx36", date: dayjs().add(3, "day"), title: "Chequeo de proyecto", description: "Reunión de chequeo de proyecto"  },
    // More events
  ];


  export const weekEvents = [
    {id: "ascx34", date: dayjs().hour(10), title: "Reunión con el equipo", description: "Reunión de coordinación" },
    {id: "ascx35", date: dayjs().add(3, "day").hour(14), title: "Chequeo de proyecto", description: "Reunión de chequeo de proyecto" },
  ];


  export const dayEvents = [
    {id: "ascx34", date: dayjs().hour(10), title: "Reunión con el equipo", description: "Reunión de coordinación" },
    {id: "ascx35", date: dayjs().hour(14), title: "Chequeo de proyecto", description: "Reunión de chequeo de proyecto" },
  ];


  // Dummy data

type Room = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  name: string;
  color: string;
};

type ReservationType = {
  id: number;
  name: string;
};
  
export const rooms = [
  { id: 1, name: "Salón 1", shortname: "S1" },
  { id: 2, name: "Salón 2", shortname: "S2" },
  { id: 3, name: "Salón 3", shortname: "S3" },
  { id: 4, name: "Salón 4", shortname: "S4" },
  { id: 5, name: "Salón 5", shortname: "S5" },
  { id: 6, name: "Salón 6", shortname: "S6" },
  { id: 7, name: "Salón 7", shortname: "S7" },
  { id: 8, name: "Salón 8", shortname: "S8" },
  { id: 9, name: "Salón 9", shortname: "S9" },
]

export const getRooms = (): Room[]  => rooms;

export const courses = [
  { id: 1, name: "Economía", color: "green" },
  { id: 2, name: "Antropología", color: "violet" },
  { id: 3, name: "Análisis matemático", color: "yellow" },
  { id: 4, name: "Administración de empresas", color: "amber" },
  { id: 5, name: "Psicología", color: "pink" },
  { id: 6, name: "Informática", color: "red" },
]

export const getCourses = (): Course[]  => courses;


export const reservationTypes = [
  { id: 1, name: "Reservación" },
  { id: 2, name: "Cita" },
  { id: 3, name: "Evento" },
  { id: 4, name: "Reunión" },
  { id: 5, name: "Congreso" },
  { id: 6, name: "Conferencia" },
]

export const getReservationTypes = (): ReservationType[]  => reservationTypes;