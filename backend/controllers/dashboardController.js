const projectModel = require('../models/projectModel');

async function showDashboard(req, res) {
  try {
    const recentProjects = await projectModel.getRecentProjects(3);
    res.render('dashboard', { recentProjects });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.render('dashboard', { recentProjects: [] });
  }
}

module.exports = { showDashboard };
