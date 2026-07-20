import { Client } from 'pg';

export async function ensureDatabaseExists() {
  const dbName = 'tomatoes';
  

  const targetUrl = process.env.DATABASE_URL || "";
  const systemUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1) + 'postgres';

  const client = new Client({
    connectionString: systemUrl,
  });

  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error("Error ensuring database exists:", err);
  } finally {
    await client.end();
  }
}