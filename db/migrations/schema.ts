import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, bigint, varchar, smallint, date, datetime } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const carrera = mysqlTable("Carrera", {
	carreraId: bigint("CarreraId", { mode: "number" }).autoincrement().notNull(),
	carreraCodigo: varchar("CarreraCodigo", { length: 60 }).notNull(),
	carreraNombre: varchar("CarreraNombre", { length: 60 }).notNull(),
	carreraColor: varchar("CarreraColor", { length: 7 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.carreraId], name: "Carrera_CarreraId"}),
]);

export const materia = mysqlTable("Materia", {
	materiaId: varchar("MateriaId", { length: 12 }).notNull(),
	materiaNombre: varchar("MateriaNombre", { length: 60 }).notNull(),
	materiaCodigo: varchar("MateriaCodigo", { length: 20 }).notNull(),
	materiaNivelCarrera: smallint("MateriaNivelCarrera").notNull(),
	carrerasId: bigint("CarrerasId", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.materiaId], name: "Materia_MateriaId"}),
]);

export const parametros = mysqlTable("Parametros", {
	parametrosId: bigint("ParametrosId", { mode: "number" }).notNull(),
	parametrosUrlCalendario: varchar("ParametrosUrlCalendario", { length: 500 }).notNull(),
	parametrosCarpetaPlanosSalon: varchar("ParametrosCarpetaPlanosSalon", { length: 500 }).notNull(),
	parametrosEmailSmtpServer: varchar("ParametrosEmailSMTPServer", { length: 100 }).notNull(),
	parametrosEmailSmtpPort: smallint("ParametrosEmailSMTPPort").notNull(),
	parametrosEmailSmtpUser: varchar("ParametrosEmailSMTPUser", { length: 100 }).notNull(),
	parametrosEmailSmtpPassword: varchar("ParametrosEmailSMTPPassword", { length: 100 }).notNull(),
	parametrosEmailSenderEmail: varchar("ParametrosEmailSenderEmail", { length: 100 }).notNull(),
	parametrosEmailSenderName: varchar("ParametrosEmailSenderName", { length: 100 }).notNull(),
	parametrosEmailUseSsl: tinyint("ParametrosEmailUseSSL").notNull(),
	parametrosIdRolCoordinadorLicenciatura: bigint("ParametrosIdRolCoordinadorLicenciatura", { mode: "number" }).notNull(),
	parametrosCarpetaInscriptosCurso: varchar("ParametrosCarpetaInscriptosCurso", { length: 500 }).notNull(),
	parametrosUrlVisualizarReserva: varchar("ParametrosUrlVisualizarReserva", { length: 500 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.parametrosId], name: "Parametros_ParametrosId"}),
]);

export const reserva = mysqlTable("Reserva", {
	reservaId: bigint("ReservaId", { mode: "number" }).autoincrement().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	reservaFecha: date("ReservaFecha", { mode: 'string' }).notNull(),
	reservaHoraInicio: datetime("ReservaHoraInicio", { mode: 'string'}).notNull(),
	reservaHoraFin: datetime("ReservaHoraFin", { mode: 'string'}).notNull(),
	tipoReservaId: bigint("TipoReservaId", { mode: "number" }),
	reservaFrecuencia: smallint("ReservaFrecuencia").notNull(),
	reservaEstado: smallint("ReservaEstado").notNull(),
	reservaReplicacble: tinyint("ReservaReplicacble").notNull(),
	materiaId: varchar("MateriaId", { length: 12 }),
	cursoId: bigint("CursoId", { mode: "number" }),
	grupoId: bigint("GrupoId", { mode: "number" }),
	reservaDescripcion: varchar("ReservaDescripcion", { length: 240 }).notNull(),
	reservaRequiereAutorizacion: tinyint("ReservaRequiereAutorizacion").default(0).notNull(),
	reservaGestor: varchar("ReservaGestor", { length: 60 }).notNull(),
	reservaAutorizacion: varchar("ReservaAutorizacion", { length: 60 }).notNull(),
	reservaFechaCreacion: datetime("ReservaFechaCreacion", { mode: 'string'}).notNull(),
	reservaGestorLogin: varchar("ReservaGestorLogin", { length: 60 }).notNull(),
	reservaNombre: varchar("ReservaNombre", { length: 120 }).default(').notNull(),
	reservaColor: varchar("ReservaColor", { length: 20 }).default(').notNull(),
},
(table) => [
	primaryKey({ columns: [table.reservaId], name: "Reserva_ReservaId"}),
]);

export const reservaSalones = mysqlTable("ReservaSalones", {
	reservaId: bigint("ReservaId", { mode: "number" }).notNull(),
	salonId: bigint("SalonId", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.reservaId, table.salonId], name: "ReservaSalones_ReservaId_SalonId"}),
]);

export const salon = mysqlTable("Salon", {
	salonId: bigint("SalonId", { mode: "number" }).autoincrement().notNull(),
	salonDescripcion: varchar("SalonDescripcion", { length: 60 }).notNull(),
	salonIdentificador: varchar("SalonIdentificador", { length: 60 }).notNull(),
	tipoSalonId: bigint("TipoSalonId", { mode: "number" }).notNull(),
	salonCapacidad: smallint("SalonCapacidad").notNull(),
	salonUbicacionId: bigint("SalonUbicacionId", { mode: "number" }).notNull(),
	salonUbicacionPlano: varchar("SalonUbicacionPlano", { length: 512 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.salonId], name: "Salon_SalonId"}),
]);

export const solicitudReserva = mysqlTable("SolicitudReserva", {
	solicitudReservaId: bigint("SolicitudReservaId", { mode: "number" }).autoincrement().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	solicitudReservaFecha: date("SolicitudReservaFecha", { mode: 'string' }).notNull(),
	solicitudReservaHoraInicio: datetime("SolicitudReservaHoraInicio", { mode: 'string'}).notNull(),
	solicitudReservaHoraFin: datetime("SolicitudReservaHoraFin", { mode: 'string'}).notNull(),
	solicitudReservaEstado: smallint("SolicitudReservaEstado").notNull(),
	reservaId: bigint("ReservaId", { mode: "number" }),
	solicitanteMail: varchar("SolicitanteMail", { length: 100 }).notNull(),
	solicitanteNombre: varchar("SolicitanteNombre", { length: 60 }).notNull(),
	solicitudReservaDescripcion: varchar("SolicitudReservaDescripcion", { length: 240 }).notNull(),
	solicitudTipoReservaId: bigint("SolicitudTipoReservaId", { mode: "number" }),
},
(table) => [
	primaryKey({ columns: [table.solicitudReservaId], name: "SolicitudReserva_SolicitudReservaId"}),
]);

export const tipoReserva = mysqlTable("TipoReserva", {
	tipoReservaId: bigint("TipoReservaId", { mode: "number" }).notNull(),
	tipoReservaNombre: varchar("TipoReservaNombre", { length: 60 }).notNull(),
	tipoReservaColor: varchar("TipoReservaColor", { length: 20 }).notNull(),
	tipoReservaReplicable: tinyint("TipoReservaReplicable"),
},
(table) => [
	primaryKey({ columns: [table.tipoReservaId], name: "TipoReserva_TipoReservaId"}),
]);
