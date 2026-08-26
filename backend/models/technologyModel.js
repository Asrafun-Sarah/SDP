// Technologies (e.g. "Arduino", "C++") are stored once each in the
// technologies table, then linked to projects through project_technologies.
// This avoids storing the same technology name over and over.

const pool = require('../config/db');

// If a technology with this name already exists, return its id.
// Otherwise create it and return the new id.
async function findOrCreateTechnology(name) {
  const cleanName = name.trim();
  const existing = await pool.query('SELECT id FROM technologies WHERE name = $1', [cleanName]);
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const created = await pool.query(
    'INSERT INTO technologies (name) VALUES ($1) RETURNING id',
    [cleanName]
  );
  return created.rows[0].id;
}

module.exports = { findOrCreateTechnology };
