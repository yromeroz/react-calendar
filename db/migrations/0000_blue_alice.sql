CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"roomid" INTEGER NOT NULL,
	"courseid" INTEGER NOT NULL,
	"reservationtype" INTEGER NOT NULL
);
