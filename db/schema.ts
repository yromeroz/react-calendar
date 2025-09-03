import { mysqlTable } from 'drizzle-orm/mysql-core';
import * as t from "drizzle-orm/mysql-core";
// import { sql } from "drizzle-orm";

// Events schema
export const eventsTable = mysqlTable(
  'events',
  {
    id: t.int('id').primaryKey().autoincrement(),
    date: t.timestamp('date').notNull(),
    title: t.varchar('title', { length: 100 }).notNull(),
    description: t.text('description').notNull(),
    room: t.int('roomid').notNull().references(() => roomsTable.id),
    course: t.int('courseid').notNull().references(() => coursesTable.id),
    reservationType: t.int('reservationtypeid').notNull().references(() => eventTypesTable.id),
    endTime: t.timestamp('endtime').notNull(),
  }
);

// Rooms schema
export const roomsTable = mysqlTable(
  'rooms',
  {
    id: t.int('id').primaryKey().autoincrement(),
    name: t.varchar('name', { length: 100 }).notNull(),
    shorname: t.varchar('shortname', { length: 100 }).notNull(),
  }
);

// Courses schema
export const coursesTable = mysqlTable(
  'courses',
  {
    id: t.int('id').primaryKey().autoincrement(),
    name: t.varchar('name', { length: 100 }).notNull(),
    color: t.varchar('color', { length: 100 }).notNull(),
  }
);

// Reservation types schema
export const eventTypesTable = mysqlTable(
  'event_types',
  {
    id: t.int('id').primaryKey().autoincrement(),
    name: t.varchar('name', { length: 100 }).notNull(),
  }
);

// ============== Official Tables ==================
// Materia schema
export const materiaTable = mysqlTable(
  'Materia',
  {
    id: t.bigint('MateriaId', { mode: 'bigint' }).primaryKey().autoincrement(),
    name: t.varchar('MateriaNombre', { length: 60 }).notNull(),
    code: t.varchar('MateriaCodigo', { length: 20 }).notNull(),
    carreerLevel: t.smallint('MateriaNivelCarrera').notNull(),
    carreerId: t.bigint('CarrerasId', { mode: 'bigint' }).notNull(),
  }
);

// TipoReserva schema
export const tipoReservaTable = mysqlTable(
  'TipoReserva',
  {
    id: t.bigint('TipoReservaId', { mode: 'bigint' }).primaryKey().autoincrement(),
    name: t.varchar('TipoReservaNombre', { length: 60 }).notNull(),
    color: t.varchar('TipoReservaColor', { length: 20 }).notNull(),
  }
);

// Salon schema
export const salonTable = mysqlTable(
  'Salon',
  {
    id: t.bigint('SalonId', { mode: 'bigint' }).primaryKey().autoincrement(),
    description: t.varchar('SalonDescripcion', { length: 60 }).notNull(),
    name: t.varchar('SalonIdentificador', { length: 60 }).notNull(),
    typeId: t.bigint('TipoSalonId', { mode: 'bigint' }).notNull(),
    capacity: t.smallint('SalonCapacidad').notNull(),
    locationId: t.bigint('SalonUbicacionId', { mode: 'bigint' }).notNull(),
    location: t.varchar('SalonUbicacionPlano', { length: 512 }).notNull(),
  }
)

// Reserva schema
export const reservaTable = mysqlTable(
  'Reserva',
  {
    id: t.bigint('ReservaId', { mode: 'bigint' }).primaryKey().autoincrement(),
    date: t.date('ReservaFecha').notNull(),
    roomid: t.bigint('SalonId', { mode: 'bigint' }),
    time: t.datetime('ReservaHoraInicio').notNull(),
    endTime: t.datetime('ReservaHoraFin').notNull(),
    courseId: t.bigint('CursoId', { mode: 'bigint' }),
    groupId: t.bigint('GrupoId', { mode: 'bigint' }),
    frequency: t.smallint('ReservaFrecuencia').notNull(),
    state: t.smallint('ReservaEstado').notNull(),
    isReplicable: t.tinyint('ReservaReplicable').notNull(),
    subjectId: t.bigint('MateriaId', { mode: 'bigint' }).references(() => materiaTable.id),
    description: t.varchar('ReservaDescripcion', { length: 240 }).notNull(),
    typeId: t.bigint('TipoReservaId', { mode: 'bigint' }).references(() => tipoReservaTable.id),
  }
)

// SolicitudReserva schema
export const solicitudReservaTable = mysqlTable(
  'SolicitudReserva',
  {
    id: t.bigint('SolicitudReservaId', { mode: 'bigint' }).primaryKey().autoincrement(),
    date: t.date('SolicitudReservaFecha').notNull(),
    time: t.datetime('SolicitudReservaHoraInicio').notNull(),
    endTime: t.datetime('SolicitudReservaHoraFin').notNull(),
    state: t.smallint('SolicitudReservaEstado').notNull(),
    reservationId: t.bigint('ReservaId', { mode: 'bigint' }).references(() => reservaTable.id),
    requesterEmail: t.varchar('SolicitanteEmail', { length: 100 }).notNull(),
    requesterName: t.varchar('SolicitanteNombre', { length: 60 }).notNull(),
    description: t.varchar('SolicitudReservaDescripcion', { length: 240 }).notNull(),
    typeId: t.bigint('TipoReservaId', { mode: 'bigint' }).references(() => tipoReservaTable.id),
  }
)  