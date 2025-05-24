import { PGlite } from '@electric-sql/pglite';

export const db = new PGlite('idb://patient-db');

export const broadcastChannel = new BroadcastChannel('patient-sync');

export async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL NOT NULL,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid()
      )
    `);
    console.log("Database ready!");
  } catch (err) {
    console.error("DB setup failed:", err);
    throw err;
  }
}

export async function syncQuery(query, params = []) {
  try {
    const result = await db.query(query, params);
    return result;
  } 
  catch (err) {
    console.error("Query failed:", query, err);
    throw err;
  }
}

export async function getPatients() {
  const result = await db.query("SELECT * FROM patients ORDER BY created_at DESC");
  console.log(`Loaded ${result.rows.length} patients from DB`);
  return result.rows.filter(p => p && p.name && p.age != null && p.gender);;
}