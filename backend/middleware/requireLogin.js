// This middleware protects routes that require a logged-in user.
// If there's no user in the session, we redirect to the login page
// instead of letting the request continue.

function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please log in to continue.');
    return res.redirect('/login');
  }
  next();
}

module.exports = requireLogin;
