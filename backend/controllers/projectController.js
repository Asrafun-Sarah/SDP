const projectModel = require('../models/projectModel');
const { uploadBuffer } = require('../config/cloudinary');

// Browse + search page. Query params: q (keyword), department, course.
async function browse(req, res) {
  try {
    const { q, department, course } = req.query;
    const projects = await projectModel.searchProjects({ keyword: q, department, course });
    const filterOptions = await projectModel.getFilterOptions();

    res.render('projects', {
      projects,
      filterOptions,
      query: { q: q || '', department: department || '', course: course || '' }
    });
  } catch (err) {
    console.error('Browse error:', err);
    res.render('projects', {
      projects: [],
      filterOptions: { departments: [], courses: [] },
      query: { q: '', department: '', course: '' }
    });
  }
}

async function showDetails(req, res) {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).render('error', { message: 'Project not found.' });
    }
    res.render('projectDetails', { project });
  } catch (err) {
    console.error('Project details error:', err);
    res.status(500).render('error', { message: 'Something went wrong loading this project.' });
  }
}

function showUploadForm(req, res) {
  res.render('uploadProject', { project: null });
}

// Uploads any attached files to Cloudinary and returns their URLs.
// req.files comes from multer, grouped by field name.
async function uploadAttachedFiles(files) {
  const urls = {};
  if (files.reportFile) {
    urls.reportFileUrl = await uploadBuffer(files.reportFile[0].buffer, 'projectforge/reports');
  }
  if (files.sourceCodeFile) {
    urls.sourceCodeUrl = await uploadBuffer(files.sourceCodeFile[0].buffer, 'projectforge/source-code');
  }
  if (files.presentationFile) {
    urls.presentationUrl = await uploadBuffer(files.presentationFile[0].buffer, 'projectforge/presentations');
  }
  return urls;
}

async function handleUpload(req, res) {
  try {
    const { title, description, department, course, academicYear, projectType, technologies } = req.body;

    if (!title || !description) {
      req.flash('error', 'Title and description are required.');
      return res.redirect('/projects/upload');
    }

    const fileUrls = await uploadAttachedFiles(req.files || {});
    const technologyNames = (technologies || '').split(',').map(t => t.trim()).filter(Boolean);

    const projectId = await projectModel.createProject({
      userId: req.session.user.id,
      title, description, department, course, academicYear, projectType,
      reportFileUrl: fileUrls.reportFileUrl || null,
      sourceCodeUrl: fileUrls.sourceCodeUrl || null,
      presentationUrl: fileUrls.presentationUrl || null
    }, technologyNames);

    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error('Upload error:', err);
    req.flash('error', 'Something went wrong uploading your project.');
    res.redirect('/projects/upload');
  }
}

async function showMyProjects(req, res) {
  try {
    const projects = await projectModel.getProjectsByUser(req.session.user.id);
    res.render('myProjects', { projects });
  } catch (err) {
    console.error('My projects error:', err);
    res.render('myProjects', { projects: [] });
  }
}

async function showEditForm(req, res) {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).render('error', { message: 'Project not found.' });
    }
    if (project.user_id !== req.session.user.id) {
      return res.status(403).render('error', { message: 'You can only edit your own projects.' });
    }
    res.render('editProject', { project });
  } catch (err) {
    console.error('Edit form error:', err);
    res.status(500).render('error', { message: 'Something went wrong.' });
  }
}

async function handleEdit(req, res) {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).render('error', { message: 'Project not found.' });
    }
    if (project.user_id !== req.session.user.id) {
      return res.status(403).render('error', { message: 'You can only edit your own projects.' });
    }

    const { title, description, department, course, academicYear, projectType, technologies } = req.body;
    const fileUrls = await uploadAttachedFiles(req.files || {});
    const technologyNames = (technologies || '').split(',').map(t => t.trim()).filter(Boolean);

    await projectModel.updateProject(req.params.id, {
      title, description, department, course, academicYear, projectType,
      reportFileUrl: fileUrls.reportFileUrl || null,
      sourceCodeUrl: fileUrls.sourceCodeUrl || null,
      presentationUrl: fileUrls.presentationUrl || null
    }, technologyNames);

    res.redirect(`/projects/${req.params.id}`);
  } catch (err) {
    console.error('Edit error:', err);
    req.flash('error', 'Something went wrong saving your changes.');
    res.redirect(`/projects/${req.params.id}/edit`);
  }
}

async function handleDelete(req, res) {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).render('error', { message: 'Project not found.' });
    }
    if (project.user_id !== req.session.user.id) {
      return res.status(403).render('error', { message: 'You can only delete your own projects.' });
    }
    await projectModel.deleteProject(req.params.id);
    res.redirect('/my-projects');
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).render('error', { message: 'Something went wrong deleting this project.' });
  }
}

module.exports = {
  browse, showDetails, showUploadForm, handleUpload,
  showMyProjects, showEditForm, handleEdit, handleDelete
};
