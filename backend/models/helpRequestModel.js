// All database queries related to help requests live in this file.

const pool = require('../config/db');

async function createRequest({ senderId, receiverId, projectId, message }) {
  await pool.query(
    `INSERT INTO help_requests (sender_id, receiver_id, project_id, message, status)
     VALUES ($1, $2, $3, $4, 'pending')`,
    [senderId, receiverId, projectId || null, message]
  );
}

// Requests this user sent to others, with the receiver's name and status.
async function getSentRequests(userId) {
  const result = await pool.query(
    `SELECT hr.*, u.full_name AS receiver_name, p.title AS project_title
     FROM help_requests hr
     JOIN users u ON u.id = hr.receiver_id
     LEFT JOIN projects p ON p.id = hr.project_id
     WHERE hr.sender_id = $1
     ORDER BY hr.created_at DESC`,
    [userId]
  );
  return result.rows;
}

// Requests this user received from others, with the sender's name.
async function getReceivedRequests(userId) {
  const result = await pool.query(
    `SELECT hr.*, u.full_name AS sender_name, p.title AS project_title
     FROM help_requests hr
     JOIN users u ON u.id = hr.sender_id
     LEFT JOIN projects p ON p.id = hr.project_id
     WHERE hr.receiver_id = $1
     ORDER BY hr.created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function getRequestById(id) {
  const result = await pool.query('SELECT * FROM help_requests WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateStatus(id, status) {
  await pool.query('UPDATE help_requests SET status = $1 WHERE id = $2', [status, id]);
}

module.exports = { createRequest, getSentRequests, getReceivedRequests, getRequestById, updateStatus };
