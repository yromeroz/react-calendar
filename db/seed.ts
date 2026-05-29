import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import { config } from "dotenv";
import mysql from "mysql2/promise";
import * as schema from "./schema";

config({ path: ".env.local" });

const colorList = [
  { hex: "#FF0000", name: "Rojo" },
  { hex: "#FA8072", name: "Salmón" },
  { hex: "#FFC0CB", name: "Rosa" },
  { hex: "#FF1493", name: "Rosa Intenso" },
  { hex: "#FF7F50", name: "Coral" },
  { hex: "#FF8C00", name: "Naranja Oscuro" },
  { hex: "#FFD700", name: "Dorado" },
  { hex: "#FF00FF", name: "Magenta" },
  { hex: "#800080", name: "Morado" },
  { hex: "#32CD32", name: "Verde Lima" },
  { hex: "#008000", name: "Verde" },
  { hex: "#008080", name: "Verde Azulado" },
  { hex: "#40E0D0", name: "Turqueza" },
  { hex: "#4169E1", name: "Azul Rey" },
  { hex: "#000080", name: "Azul Marino" },
  { hex: "#D2691E", name: "Chocolate" },
  { hex: "#A52A2A", name: "Marrón" },
  { hex: "#A9A9A9", name: "Gris" },
  { hex: "#808080", name: "Gris Oscuro" },
  { hex: "#000000", name: "Negro" },
  { hex: "#6d9eeb", name: "Azul aciano" },
  { hex: "#e26479", name: "Rosa coqueto" },
  { hex: "#82c069", name: "Verde mar" },
  { hex: "#ef911e", name: "Naranja" },
  { hex: "#980000", name: "Granate" },
  { hex: "#585faf", name: "Azul Pizarra" },
  { hex: "#ea987f", name: "Salmón oscuro" },
  { hex: "#666666", name: "Gris intenso" },
  { hex: "#fff2cc", name: "Almendra" },
  { hex: "#e6def7", name: "Morado Relajante" },
  { hex: "#8e7cc3", name: "Morado Suave" },
  { hex: "#4bc1c7", name: "Turquesa medio" },
];

const tipoReservaColors = [
  { id: 2, hex: "#FF0000", name: "Rojo" },
  { id: 3, hex: "#FF7F50", name: "Coral" },
  { id: 4, hex: "#FFD700", name: "Dorado" },
  { id: 5, hex: "#4169E1", name: "Azul Rey" },
  { id: 6, hex: "#32CD32", name: "Verde Lima" },
  { id: 7, hex: "#800080", name: "Morado" },
  { id: 8, hex: "#FF8C00", name: "Naranja Oscuro" },
  { id: 9, hex: "#40E0D0", name: "Turqueza" },
  { id: 10, hex: "#e26479", name: "Rosa coqueto" },
  { id: 11, hex: "#585faf", name: "Azul Pizarra" },
];

const carreraColors = [
  { code: "INF", hex: "#008000", name: "Ingeniería Informática" },
  { code: "IND", hex: "#000080", name: "Ingeniería Industrial" },
  { code: "CIV", hex: "#FF00FF", name: "Ingeniería Civil" },
  { code: "ELE", hex: "#FF1493", name: "Ingeniería Eléctrica" },
  { code: "MEC", hex: "#D2691E", name: "Ingeniería Mecánica" },
  { code: "QUI", hex: "#008080", name: "Ingeniería Química" },
  { code: "ALI", hex: "#ef911e", name: "Ingeniería en Alimentos" },
  { code: "SIS", hex: "#4bc1c7", name: "Ingeniería de Sistemas" },
  { code: "TEL", hex: "#82c069", name: "Ingeniería en Telecomunicaciones" },
  { code: "GES", hex: "#6d9eeb", name: "Ingeniería en Gestión" },
];

const materiaEntries = [
  { id: "MAT101", name: "Matemáticas I", code: "MAT101", level: 1 },
  { id: "FIS101", name: "Física I", code: "FIS101", level: 1 },
  { id: "PRO101", name: "Programación I", code: "PRO101", level: 1 },
  { id: "QUI101", name: "Química General", code: "QUI101", level: 1 },
].map(m => ({ ...m, nameCode: `${m.name} - ${m.code}` }));

const salonEntries = [
  { id: BigInt(1), description: "Salón A - Planta Baja", name: "A1", typeId: BigInt(1), capacity: 40, locationId: BigInt(1), location: "planta_baja.png" },
  { id: BigInt(2), description: "Salón B - Primer Piso", name: "B1", typeId: BigInt(1), capacity: 35, locationId: BigInt(1), location: "primer_piso.png" },
  { id: BigInt(3), description: "Salón C - Segundo Piso", name: "C1", typeId: BigInt(1), capacity: 30, locationId: BigInt(1), location: "segundo_piso.png" },
  { id: BigInt(4), description: "Laboratorio de Informática", name: "LAB1", typeId: BigInt(2), capacity: 25, locationId: BigInt(1), location: "planta_baja.png" },
  { id: BigInt(5), description: "Auditorio Principal", name: "AUDI", typeId: BigInt(3), capacity: 100, locationId: BigInt(1), location: "planta_baja.png" },
];

const eventColors = colorList.filter(
  (c) =>
    !tipoReservaColors.some((t) => t.hex === c.hex) &&
    !carreraColors.some((cc) => cc.hex === c.hex)
);

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL as string);
  const db = drizzle(pool, { schema, mode: "default" });

  console.log("Limpiando tablas existentes...");
  await db.delete(schema.reservaSalonesTable);
  await db.delete(schema.reservaTable);
  await db.delete(schema.salonTable);
  await db.delete(schema.carreraTable);
  await db.delete(schema.materiaTable);
  await db.delete(schema.tipoReservaTable);

  console.log("Insertando TipoReserva...");
  for (const tr of tipoReservaColors) {
    await db.insert(schema.tipoReservaTable).values({
      id: BigInt(tr.id),
      name: tr.name,
      color: tr.hex,
    });
  }

  console.log("Insertando Carreras...");
  for (let i = 0; i < carreraColors.length; i++) {
    await db.insert(schema.carreraTable).values({
      code: carreraColors[i].code,
      name: carreraColors[i].name,
      color: carreraColors[i].hex,
    });
  }

  console.log("Insertando Materias...");
  for (const m of materiaEntries) {
    await db.insert(schema.materiaTable).values({
      id: m.id,
      name: m.name,
      code: m.code,
      nameCode: m.nameCode,
      carreerLevel: m.level,
      carrerasId: BigInt(1),
    });
  }

  console.log("Insertando Salones...");
  for (const s of salonEntries) {
    await db.execute(
      sql`INSERT INTO Salon (SalonId, SalonDescripcion, SalonIdentificador, TipoSalonId, SalonCapacidad, SalonUbicacionId, SalonUbicacionPlano)
          VALUES (${s.id}, ${s.description}, ${s.name}, ${s.typeId}, ${s.capacity}, ${s.locationId}, ${s.location})`
    );
  }

  console.log("Insertando Reservas con colores restantes...");
  const today = new Date();
  const subjectIds = materiaEntries.map((m) => m.id);
  const typeIds = tipoReservaColors.map((t) => BigInt(t.id));

  for (let i = 0; i < eventColors.length; i++) {
    const ec = eventColors[i];
    const dayOffset = i;
    const startHour = 8 + (i % 9);
    const eventDate = new Date(today);
    eventDate.setDate(eventDate.getDate() + dayOffset);

    const startTime = new Date(eventDate);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startHour + 1, 0, 0, 0);

    const subjectId = subjectIds[i % subjectIds.length];
    const typeId = typeIds[i % typeIds.length];

    await db.insert(schema.reservaTable).values({
      date: eventDate,
      time: startTime,
      endTime: endTime,
      courseId: BigInt((i % 3) + 1),
      groupId: BigInt(1),
      state: 1,
      frecuencia: 1,
      replicable: 0,
      subjectId: subjectId,
      description: `Reserva de prueba - ${ec.name}`,
      typeId: typeId,
      authRequired: 0,
      createdAt: startTime,
      manager: "admin",
      authorization: "admin",
      managerLogin: "admin",
      name: `Evento ${ec.name}`,
      color: ec.hex,
    });
  }

  const insertedReservas = await db
    .select({ id: schema.reservaTable.id })
    .from(schema.reservaTable)
    .orderBy(schema.reservaTable.id);

  console.log("Insertando relaciones ReservaSalones...");
  const salonIds = salonEntries.map((s) => s.id);
  for (let i = 0; i < insertedReservas.length; i++) {
    await db.execute(
      sql`INSERT INTO ReservaSalones (ReservaId, SalonId)
          VALUES (${insertedReservas[i].id}, ${salonIds[i % salonIds.length]})`
    );
  }

  console.log("Seed completado exitosamente!");
  console.log(`  - ${tipoReservaColors.length} TipoReserva`);
  console.log(`  - ${carreraColors.length} Carreras`);
  console.log(`  - ${materiaEntries.length} Materias`);
  console.log(`  - ${salonEntries.length} Salones`);
  console.log(`  - ${eventColors.length} Reservas (colores restantes)`);

  await pool.end();
}

main().catch((err) => {
  console.error("Error durante el seed:", err);
  process.exit(1);
});
