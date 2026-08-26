// This is the entry point of our whole application.
// Running "node server.js" starts the web server.

require('dotenv').config(); // loads variables from .env into process.env

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// EJS is our templating engine — it lets us build HTML pages that
// include dynamic data (like a project title from the database).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Serves files in /public directly, e.g. /css/style.css, /js/main.js
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Lets Express read form data (e.g. from the login form) from req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions let us remember that a user is logged in between requests.
// Express stores a signed cookie in the browser; the actual session
// data (like req.session.user) lives on the server.
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_only_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Flash messages are short-lived messages (like "Incorrect password")
// that survive exactly one redirect, then disappear.
app.use(flash());

// Makes the logged-in user and any flash error available to EVERY view,
// without having to pass them in manually from every controller.
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.flashError = req.flash('error');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('landing');
});

app.use(require('./routes/auth'));
app.use(require('./routes/dashboard'));
app.use(require('./routes/projects'));
app.use(require('./routes/profiles'));
app.use(require('./routes/helpRequests'));

// Catch-all for unmatched routes.
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ProjectForge server running on http://localhost:${PORT}`);
});
