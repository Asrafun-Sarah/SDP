const express = require('express');
const multer = require('multer');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const projectController = require('../controllers/projectController');

// Files are held in memory briefly, then streamed straight to Cloudinary —
// we never write uploaded files to the server's own disk.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const projectFiles = upload.fields([
  { name: 'reportFile', maxCount: 1 },
  { name: 'sourceCodeFile', maxCount: 1 },
  { name: 'presentationFile', maxCount: 1 }
]);

// IMPORTANT: specific routes (like /projects/upload) must be registered
// BEFORE the generic "/projects/:id" route. Express matches routes in
// the order they're defined, and ":id" would otherwise match the literal
// word "upload" as if it were a project id.

router.get('/projects/upload', requireLogin, projectController.showUploadForm);
router.post('/projects/upload', requireLogin, projectFiles, projectController.handleUpload);

router.get('/my-projects', requireLogin, projectController.showMyProjects);

router.get('/projects/:id/edit', requireLogin, projectController.showEditForm);
router.post('/projects/:id/edit', requireLogin, projectFiles, projectController.handleEdit);
router.post('/projects/:id/delete', requireLogin, projectController.handleDelete);

// Public routes — generic ":id" route goes last.
router.get('/projects', projectController.browse);
router.get('/projects/:id', projectController.showDetails);

module.exports = router;
