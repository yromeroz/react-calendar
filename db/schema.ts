import { relations } from 'drizzle-orm';
import { mysqlTable } from 'drizzle-orm/mysql-core';
import * as t from "drizzle-orm/mysql-core";

// ============== Official Tables ==================
// Materia schema
export const materiaTable = mysqlTable(
  'Materia',
  {
    id: t.varchar('MateriaId', { length: 12 }).primaryKey(),
    name: t.varchar('MateriaNombre', { length: 60 }).notNull(),
    code: t.varchar('MateriaCodigo', { length: 20 }).notNull(),
    carreerLevel: t.smallint('MateriaNivelCarrera').notNull(),
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
    time: t.datetime('ReservaHoraInicio').notNull(),
    endTime: t.datetime('ReservaHoraFin').notNull(),
    courseId: t.bigint('CursoId', { mode: 'bigint' }),
    groupId: t.bigint('GrupoId', { mode: 'bigint' }),
    state: t.smallint('ReservaEstado').notNull(),
    subjectId: t.varchar('MateriaId', { length: 12 }).references(() => materiaTable.id),
    description: t.varchar('ReservaDescripcion', { length: 240 }).notNull(),
    typeId: t.bigint('TipoReservaId', { mode: 'bigint' }).references(() => tipoReservaTable.id),
    authRequired: t.tinyint('ReservaRequiereAutorizacion').notNull(),
    createdAt: t.datetime('ReservaFechaCreacion').notNull(),
    manager: t.varchar('ReservaGestor', { length: 60 }).notNull(),
    authorization: t.varchar('ReservaAutorizacion', { length: 60 }).notNull(),
    managerLogin: t.varchar('ReservaGestorLogin', { length: 60 }).notNull(),
    name: t.varchar('ReservaNombre', { length: 120 }).notNull(),
    color: t.varchar('ReservaColor', { length: 20 }).notNull(),
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
    requesterEmail: t.varchar('SolicitanteMail', { length: 100 }).notNull(),
    requesterName: t.varchar('SolicitanteNombre', { length: 60 }).notNull(),
    description: t.varchar('SolicitudReservaDescripcion', { length: 240 }).notNull(),
    typeId: t.bigint('SolicitudTipoReservaId', { mode: 'bigint' }).references(() => tipoReservaTable.id),
  }
)

// ReservaSalones schema
export const reservaSalonesTable = mysqlTable(
  'ReservaSalones',
  {
    reservaId: t.bigint('ReservaId', { mode: 'bigint' }).references(() => reservaTable.id),
    salonId: t.bigint('SalonId', { mode: 'bigint' }).references(() => salonTable.id),
  },
  (table) => ({ 
    primaryKey: t.primaryKey({ columns: [table.reservaId, table.salonId] })
  })
)

// Parametros schema
export const parametrosTable = mysqlTable(
  'Parametros',
  {
    paramsId: t.bigint('ParametrosId', { mode: 'bigint' }).primaryKey(),
    paramsReservaUrl: t.varchar('ParametrosUrlVisualizarReserva', { length: 255 }).notNull(),
  }
)

// Carreras schema
export const carreraTable  = mysqlTable(
  'Carrera',
  {
    id: t.bigint('CarreraId', { mode: 'bigint' }).primaryKey().autoincrement(),
    code: t.varchar('CarreraCodigo', { length: 60 }).notNull(),
    name: t.varchar('CarreraNombre', { length: 60 }).notNull(),
    color: t.varchar('CarreraColor', { length: 7 }).notNull(),
  }
)

// Relations
export const reservaRelations = relations(reservaTable, ({ one, many }) => ({
  reservaSalones: many(reservaSalonesTable),
  tipoReserva: one(tipoReservaTable, {
    fields: [reservaTable.typeId],
    references: [tipoReservaTable.id]
  }),
  materia: one(materiaTable, {
    fields: [reservaTable.subjectId],
    references: [materiaTable.id]
  })
}))

export const salonRelations = relations(salonTable, ({ many }) => ({
  reservaSalones: many(reservaSalonesTable),
}))  

export const reservaSalonesRelations = relations(reservaSalonesTable, ({ one }) => ({
  reserva: one(reservaTable, {
    fields: [reservaSalonesTable.reservaId],
    references: [reservaTable.id],
  }),
  salon: one(salonTable, {
    fields: [reservaSalonesTable.salonId],
    references: [salonTable.id],
  }),

}))

export const tipoReservaRelations = relations(tipoReservaTable, ({ many }) => ({
  reserva: many(reservaTable),
  solicitudReserva: many(solicitudReservaTable)  
}))

export const materiaRelations = relations(materiaTable, ({ many }) => ({
  reserva: many(reservaTable)
}))

