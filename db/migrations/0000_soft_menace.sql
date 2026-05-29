-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Carrera` (
	`CarreraId` bigint AUTO_INCREMENT NOT NULL,
	`CarreraCodigo` varchar(60) NOT NULL,
	`CarreraNombre` varchar(60) NOT NULL,
	`CarreraColor` varchar(7) NOT NULL,
	CONSTRAINT `Carrera_CarreraId` PRIMARY KEY(`CarreraId`)
);
--> statement-breakpoint
CREATE TABLE `Materia` (
	`MateriaId` varchar(12) NOT NULL,
	`MateriaNombre` varchar(60) NOT NULL,
	`MateriaCodigo` varchar(20) NOT NULL,
	`MateriaNivelCarrera` smallint NOT NULL,
	`CarrerasId` bigint NOT NULL,
	CONSTRAINT `Materia_MateriaId` PRIMARY KEY(`MateriaId`)
);
--> statement-breakpoint
CREATE TABLE `Parametros` (
	`ParametrosId` bigint NOT NULL,
	`ParametrosUrlCalendario` varchar(500) NOT NULL,
	`ParametrosCarpetaPlanosSalon` varchar(500) NOT NULL,
	`ParametrosEmailSMTPServer` varchar(100) NOT NULL,
	`ParametrosEmailSMTPPort` smallint NOT NULL,
	`ParametrosEmailSMTPUser` varchar(100) NOT NULL,
	`ParametrosEmailSMTPPassword` varchar(100) NOT NULL,
	`ParametrosEmailSenderEmail` varchar(100) NOT NULL,
	`ParametrosEmailSenderName` varchar(100) NOT NULL,
	`ParametrosEmailUseSSL` tinyint(1) NOT NULL,
	`ParametrosIdRolCoordinadorLicenciatura` bigint NOT NULL,
	`ParametrosCarpetaInscriptosCurso` varchar(500) NOT NULL,
	`ParametrosUrlVisualizarReserva` varchar(500) NOT NULL,
	CONSTRAINT `Parametros_ParametrosId` PRIMARY KEY(`ParametrosId`)
);
--> statement-breakpoint
CREATE TABLE `Reserva` (
	`ReservaId` bigint AUTO_INCREMENT NOT NULL,
	`ReservaFecha` date NOT NULL,
	`ReservaHoraInicio` datetime NOT NULL,
	`ReservaHoraFin` datetime NOT NULL,
	`TipoReservaId` bigint,
	`ReservaFrecuencia` smallint NOT NULL,
	`ReservaEstado` smallint NOT NULL,
	`ReservaReplicacble` tinyint(1) NOT NULL,
	`MateriaId` varchar(12),
	`CursoId` bigint,
	`GrupoId` bigint,
	`ReservaDescripcion` varchar(240) NOT NULL,
	`ReservaRequiereAutorizacion` tinyint(1) NOT NULL DEFAULT 0,
	`ReservaGestor` varchar(60) NOT NULL,
	`ReservaAutorizacion` varchar(60) NOT NULL,
	`ReservaFechaCreacion` datetime NOT NULL,
	`ReservaGestorLogin` varchar(60) NOT NULL,
	`ReservaNombre` varchar(120) NOT NULL DEFAULT '',
	`ReservaColor` varchar(20) NOT NULL DEFAULT '',
	CONSTRAINT `Reserva_ReservaId` PRIMARY KEY(`ReservaId`)
);
--> statement-breakpoint
CREATE TABLE `ReservaSalones` (
	`ReservaId` bigint NOT NULL,
	`SalonId` bigint NOT NULL,
	CONSTRAINT `ReservaSalones_ReservaId_SalonId` PRIMARY KEY(`ReservaId`,`SalonId`)
);
--> statement-breakpoint
CREATE TABLE `Salon` (
	`SalonId` varchar(12) NOT NULL,
	`SalonDescripcion` varchar(60) NOT NULL,
	`SalonIdentificador` varchar(60) NOT NULL,
	`TipoSalonId` bigint NOT NULL,
	`SalonCapacidad` smallint NOT NULL,
	`SalonUbicacionId` bigint NOT NULL,
	`SalonUbicacionPlano` varchar(512) NOT NULL,
	CONSTRAINT `Salon_SalonId` PRIMARY KEY(`SalonId`)
);
--> statement-breakpoint
CREATE TABLE `SolicitudReserva` (
	`SolicitudReservaId` bigint AUTO_INCREMENT NOT NULL,
	`SolicitudReservaFecha` date NOT NULL,
	`SolicitudReservaHoraInicio` datetime NOT NULL,
	`SolicitudReservaHoraFin` datetime NOT NULL,
	`SolicitudReservaEstado` smallint NOT NULL,
	`ReservaId` bigint,
	`SolicitanteMail` varchar(100) NOT NULL,
	`SolicitanteNombre` varchar(60) NOT NULL,
	`SolicitudReservaDescripcion` varchar(240) NOT NULL,
	`SolicitudTipoReservaId` bigint,
	CONSTRAINT `SolicitudReserva_SolicitudReservaId` PRIMARY KEY(`SolicitudReservaId`)
);
--> statement-breakpoint
CREATE TABLE `TipoReserva` (
	`TipoReservaId` bigint NOT NULL,
	`TipoReservaNombre` varchar(60) NOT NULL,
	`TipoReservaColor` varchar(20) NOT NULL,
	`TipoReservaReplicable` tinyint(1),
	CONSTRAINT `TipoReserva_TipoReservaId` PRIMARY KEY(`TipoReservaId`)
);

*/