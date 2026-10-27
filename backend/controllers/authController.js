const User = require('../models/User');
const { generateToken, formatUser } = require('../utils/helpers');

// POST /api/auth/register  (public - always creates a guest)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, roomNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password, phone, roomNumber, role: 'guest' });
    res.status(201).json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json(formatUser(req.user));
};
