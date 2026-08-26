// All database queries related to projects live in this file.

const pool = require('../config/db');
const { findOrCreateTechnology } = require('./technologyModel');

// Browse/search projects. All filters are optional — if a filter isn't
// passed in, it's simply not applied.
// Searches title, description, course, department, and technology name.
async function searchProjects({ keyword, department, course }) {
  const conditions = [];
  const values = [];

  if (keyword) {
    values.push(`%${keyword}%`);
    const i = values.length;
    conditions.push(`(
      p.title ILIKE $${i} OR
      p.description ILIKE $${i} OR
      p.course ILIKE $${i} OR
      p.department ILIKE $${i} OR
      EXISTS (
        SELECT 1 FROM project_technologies pt
        JOIN technologies t ON t.id = pt.technology_id
        WHERE pt.project_id = p.id AND t.name ILIKE $${i}
      )
    )`);
  }

  if (department) {
    values.push(department);
    conditions.push(`p.department = $${values.length}`);
  }

  if (course) {
    values.push(course);
    conditions.push(`p.course = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `SELECT p.*, u.full_name AS author_name
     FROM projects p
     JOIN users u ON u.id = p.user_id
     ${whereClause}
     ORDER BY p.created_at DESC`,
    values
  );

  const projects = result.rows;
  await attachTechnologies(projects);
  return projects;
}

// Adds a "technologies" array (list of names) to each project in place.
async function attachTechnologies(projects) {
  for (const project of projects) {
    const techResult = await pool.query(
      `SELECT t.name FROM technologies t
       JOIN project_technologies pt ON pt.technology_id = t.id
       WHERE pt.project_id = $1
       ORDER BY t.name`,
      [project.id]
    );
    project.technologies = techResult.rows.map(row => row.name);
  }
}

// Get a single project with its author and technologies, for the details page.
async function getProjectById(id) {
  const result = await pool.query(
    `SELECT p.*, u.full_name AS author_name, u.id AS author_id
     FROM projects p
     JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
    [id]
  );
  const project = result.rows[0];
  if (!project) return null;
  await attachTechnologies([project]);
  return project;
}

// All projects uploaded by one user — used on "My Projects" and profile pages.
async function getProjectsByUser(userId) {
  const result = await pool.query(
    `SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  const projects = result.rows;
  await attachTechnologies(projects);
  return projects;
}

// Create a new project and link its technologies.
// technologyNames is an array of strings, e.g. ["Arduino", "C++"].
async function createProject(data, technologyNames) {
  const result = await pool.query(
    `INSERT INTO projects
      (user_id, title, description, department, course, academic_year, project_type,
       report_file_url, source_code_url, presentation_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      data.userId, data.title, data.description, data.department, data.course,
      data.academicYear, data.projectType, data.reportFileUrl, data.sourceCodeUrl,
      data.presentationUrl
    ]
  );
  const projectId = result.rows[0].id;
  await linkTechnologies(projectId, technologyNames);
  return projectId;
}

// Update an existing project. Only call this after confirming the
// requesting user owns the project (done in the controller).
async function updateProject(id, data, technologyNames) {
  await pool.query(
    `UPDATE projects SET
       title = $1, description = $2, department = $3, course = $4,
       academic_year = $5, project_type = $6,
       report_file_url = COALESCE($7, report_file_url),
       source_code_url = COALESCE($8, source_code_url),
       presentation_url = COALESCE($9, presentation_url)
     WHERE id = $10`,
    [
      data.title, data.description, data.department, data.course,
      data.academicYear, data.projectType, data.reportFileUrl,
      data.sourceCodeUrl, data.presentationUrl, id
    ]
  );
  // Replace the technology links with the new list.
  await pool.query('DELETE FROM project_technologies WHERE project_id = $1', [id]);
  await linkTechnologies(id, technologyNames);
}

async function deleteProject(id) {
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
}

// Turns a list of technology name strings into rows in project_technologies,
// creating new technologies as needed.
async function linkTechnologies(projectId, technologyNames) {
  for (const rawName of technologyNames) {
    const name = rawName.trim();
    if (!name) continue;
    const techId = await findOrCreateTechnology(name);
    await pool.query(
      `INSERT INTO project_technologies (project_id, technology_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [projectId, techId]
    );
  }
}

// "Demonstrated experience" — how many of this user's projects use each
// technology. Calculated from real project data, not hard-coded.
async function getExperienceForUser(userId) {
  const result = await pool.query(
    `SELECT t.name, COUNT(*) AS project_count
     FROM project_technologies pt
     JOIN technologies t ON t.id = pt.technology_id
     JOIN projects p ON p.id = pt.project_id
     WHERE p.user_id = $1
     GROUP BY t.name
     ORDER BY project_count DESC, t.name ASC`,
    [userId]
  );
  return result.rows;
}

// Distinct departments and courses, used to populate the filter dropdowns.
async function getFilterOptions() {
  const departments = await pool.query(
    'SELECT DISTINCT department FROM projects WHERE department IS NOT NULL ORDER BY department'
  );
  const courses = await pool.query(
    'SELECT DISTINCT course FROM projects WHERE course IS NOT NULL ORDER BY course'
  );
  return {
    departments: departments.rows.map(r => r.department),
    courses: courses.rows.map(r => r.course)
  };
}

// Most recently uploaded projects, used on the dashboard.
async function getRecentProjects(limit = 3) {
  const result = await pool.query(
    `SELECT p.*, u.full_name AS author_name
     FROM projects p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [limit]
  );
  const projects = result.rows;
  await attachTechnologies(projects);
  return projects;
}

module.exports = {
  searchProjects,
  getProjectById,
  getProjectsByUser,
  createProject,
  updateProject,
  deleteProject,
  getExperienceForUser,
  getFilterOptions,
  getRecentProjects
};
