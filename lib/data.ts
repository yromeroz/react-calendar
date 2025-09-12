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

export const users = [
  {id: 1, name: "Ana", email: "anarojas@outlook.com", role: "Coordinador", color: "blue", avatar: "manager"},
  {id: 2, name: "Alvaro", email: "alvaro@outlook.com", role: "Profesor", color: "green", avatar: "teacher"},
  {id: 3, name: "Invitado", email: "", role: "Invitado", color: "gray", avatar: "guest"},
  {id: 4, name: "Silvana", email: "silvana@hotmail.com", role: "Sysadmin", color: "violet", avatar: "sysadmin"},
]

export const getUsers = () => users;