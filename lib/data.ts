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
  { id: 1, name: "Salón 1" },
  { id: 2, name: "Salón 2" },
  { id: 3, name: "Salón 3" },
  { id: 4, name: "Salón 4" },
  { id: 5, name: "Salón 5" },
  { id: 6, name: "Salón 6" },
]

export const getRooms = (): Room[]  => rooms;

export const courses = [
  { id: 1, name: "Economía", color: "blue" },
  { id: 2, name: "Antropología", color: "green" },
  { id: 3, name: "Análisis matemático", color: "yellow" },
  { id: 4, name: "Administración de empresas", color: "orange" },
  { id: 5, name: "Psicología", color: "red" },
  { id: 6, name: "Informática", color: "violet" },
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