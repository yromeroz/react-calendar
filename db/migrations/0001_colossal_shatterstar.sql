ALTER TABLE `ReservaSalones` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `ReservaSalones` MODIFY COLUMN `SalonId` varchar(12) NOT NULL;--> statement-breakpoint
ALTER TABLE `ReservaSalones` ADD PRIMARY KEY(`ReservaId`,`SalonId`);--> statement-breakpoint
ALTER TABLE `ReservaSalones` ADD CONSTRAINT `ReservaSalones_SalonId_Salon_SalonId_fk` FOREIGN KEY (`SalonId`) REFERENCES `Salon`(`SalonId`) ON DELETE no action ON UPDATE no action;