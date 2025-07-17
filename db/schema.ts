import { pgTable, text, timestamp, serial, integer } from 'drizzle-orm/pg-core';


// Events table schema
export const eventsTable = pgTable('events', {
  id: serial('id').primaryKey(),  
  date: timestamp('date').notNull(), 
  title: text('title').notNull(),  
  description: text('description').notNull(),
  room: integer('roomid').notNull(),
  course: integer('courseid').notNull(),  
  reservationType: integer('reservationtypeid').notNull(),
});