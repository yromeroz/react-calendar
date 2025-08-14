import {
  mysqlTable,
  primaryKey,
  unique,
  serial,
  text,
  timestamp,
  int,
} from 'drizzle-orm/mysql-core';
// import { sql } from "drizzle-orm";

// Events table schema
export const eventsTable = mysqlTable(
    'events', 
    {
      id: serial('id').notNull(),  
      date: timestamp('date').notNull(), 
      title: text('title').notNull(),  
      description: text('description').notNull(),
      room: int('roomid').notNull(),
      course: int('courseid').notNull(),  
      reservationType: int('reservationtypeid').notNull(),
    },
    (table) => ({
       constrains: [
          primaryKey({ columns: [table.id], name: 'id' }),
          unique('id').on(table.id),
        ],
    })    
);  