// Handles registration, login, and logout.
//
// Passwords are never stored as plain text. We use bcrypt to turn a
// password into a "hash" — a scrambled version that can be checked
// against, but not reversed back into the original password.

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

function showRegister(req, res) {
  res.render('register');
}

async function register(req, res) {
  try {
    const { fullName, email, password, department, academicYear } = req.body;

    if (!fullName || !email || !password) {
      req.flash('error', 'Full name, email, and password are required.');
      return res.redirect('/register');
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/register');
    }

    // 10 "salt rounds" is a standard, reasonable cost for bcrypt hashing.
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      fullName, email, passwordHash, department, academicYear
    });

    // Log the user in immediately after registering.
    req.session.user = { id: user.id, fullName: user.full_name, email: user.email };
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
}

function showLogin(req, res) {
  res.render('login');
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);

    if (!user) {
      req.flash('error', 'Incorrect email or password.');
      return res.redirect('/login');
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      req.flash('error', 'Incorrect email or password.');
      return res.redirect('/login');
    }

    req.session.user = { id: user.id, fullName: user.full_name, email: user.email };
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

module.exports = { showRegister, register, showLogin, login, logout };
