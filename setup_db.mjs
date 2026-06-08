import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

const connectionString = 'postgresql://postgres:HPNW9fkQBKyqUhWr@db.hbtkhvxeazqouqzqpagb.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos Supabase.');
    
    const sql = fs.readFileSync('supabase_setup.sql', 'utf8');
    await client.query(sql);
    
    console.log('¡Tablas, triggers y políticas (RLS) creadas exitosamente!');
  } catch (err) {
    console.error('Error ejecutando SQL:', err);
  } finally {
    await client.end();
  }
}

run();
