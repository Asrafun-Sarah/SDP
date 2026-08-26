// All database queries related to users live in this file.
// Keeping queries grouped by table like this makes the code easier
// to find and explain (e.g. "user_id logic is in userModel.js").

const pool = require('../config/db');

// Create a new user and return the created row (without the password hash).
async function createUser({ fullName, email, passwordHash, department, academicYear }) {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, department, academic_year)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, department, academic_year`,
    [fullName, email, passwordHash, department, academicYear]
  );
  return result.rows[0];
}

// Find a user by email — used during login to check the password.
async function findByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Find a user by id — used for profile pages and session checks.
async function findById(id) {
  const result = await pool.query(
    'SELECT id, full_name, email, department, academic_year, bio FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

module.exports = { createUser, findByEmail, findById };
