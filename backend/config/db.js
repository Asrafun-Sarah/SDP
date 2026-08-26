// This file sets up the connection to our Supabase Postgres database.
// We are not using it yet (that happens in Phase 11), but we set it
// up now so the project structure is ready.

const { Pool } = require('pg');

// A "Pool" manages multiple database connections for us automatically,
// so we don't have to open/close a connection by hand every time
// we run a query.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Supabase connections
});

module.exports = pool;
