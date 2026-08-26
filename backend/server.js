require('dotenv').config();

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_only_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.flashError = req.flash('error');
  next();
});

// API routes
app.use(require('./routes/auth'));
app.use(require('./routes/dashboard'));
app.use(require('./routes/projects'));
app.use(require('./routes/profiles'));
app.use(require('./routes/helpRequests'));

// API 404
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ProjectForge backend running on port ${PORT}`);
});