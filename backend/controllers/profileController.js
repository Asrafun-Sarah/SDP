const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');

async function showProfile(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).render('error', { message: 'Student not found.' });
    }
    const projects = await projectModel.getProjectsByUser(user.id);
    const experience = await projectModel.getExperienceForUser(user.id);

    res.render('profile', { profileUser: user, projects, experience });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).render('error', { message: 'Something went wrong loading this profile.' });
  }
}

module.exports = { showProfile };
