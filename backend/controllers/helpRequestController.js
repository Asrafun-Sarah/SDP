const helpRequestModel = require('../models/helpRequestModel');
const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');

// Shows the "request help" form. Can be reached from a project page
// (receiverId + projectId known) or a profile page (receiverId only).
async function showRequestForm(req, res) {
  try {
    const receiver = await userModel.findById(req.query.userId);
    if (!receiver) {
      return res.status(404).render('error', { message: 'Student not found.' });
    }

    let project = null;
    if (req.query.projectId) {
      project = await projectModel.getProjectById(req.query.projectId);
    }

    if (receiver.id === req.session.user.id) {
      req.flash('error', "You can't send a help request to yourself.");
      return res.redirect('back');
    }

    res.render('requestHelp', { receiver, project });
  } catch (err) {
    console.error('Show request form error:', err);
    res.status(500).render('error', { message: 'Something went wrong.' });
  }
}

async function createRequest(req, res) {
  try {
    const { receiverId, projectId, message } = req.body;

    if (!message || message.trim() === '') {
      req.flash('error', 'Please write a short message.');
      return res.redirect(`/help-requests/new?userId=${receiverId}${projectId ? `&projectId=${projectId}` : ''}`);
    }

    await helpRequestModel.createRequest({
      senderId: req.session.user.id,
      receiverId,
      projectId: projectId || null,
      message: message.trim()
    });

    res.redirect('/my-requests');
  } catch (err) {
    console.error('Create request error:', err);
    req.flash('error', 'Something went wrong sending your request.');
    res.redirect('/dashboard');
  }
}

async function showMyRequests(req, res) {
  try {
    const sent = await helpRequestModel.getSentRequests(req.session.user.id);
    const received = await helpRequestModel.getReceivedRequests(req.session.user.id);
    res.render('myRequests', { sent, received });
  } catch (err) {
    console.error('My requests error:', err);
    res.render('myRequests', { sent: [], received: [] });
  }
}

// Only the receiver of a request is allowed to accept/decline it.
async function respondToRequest(req, res) {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const request = await helpRequestModel.getRequestById(req.params.id);

    if (!request) {
      return res.status(404).render('error', { message: 'Request not found.' });
    }
    if (request.receiver_id !== req.session.user.id) {
      return res.status(403).render('error', { message: 'You can only respond to requests sent to you.' });
    }
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).render('error', { message: 'Invalid response.' });
    }

    await helpRequestModel.updateStatus(req.params.id, status);
    res.redirect('/my-requests');
  } catch (err) {
    console.error('Respond to request error:', err);
    res.status(500).render('error', { message: 'Something went wrong.' });
  }
}

module.exports = { showRequestForm, createRequest, showMyRequests, respondToRequest };
