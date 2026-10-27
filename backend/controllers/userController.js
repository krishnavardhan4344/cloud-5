const User = require('../models/User');
const { formatUser } = require('../utils/helpers');

// GET /api/users?role=guest   (admin)
exports.getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users.map(formatUser));
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id   (admin, staff, or the user themselves)
exports.getUser = async (req, res, next) => {
  try {
    const isSelf = String(req.user._id) === req.params.id;
    if (!isSelf && req.user.role === 'guest') {
      return res.status(403).json({ message: 'You do not have permission to do this' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(formatUser(user));
  } catch (err) {
    next(err);
  }
};

// POST /api/users   (admin creates guests or staff)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, roomNumber, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (role && !['guest', 'staff'].includes(role)) {
      return res.status(400).json({ message: 'Role must be guest or staff' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password, phone, roomNumber, role: role || 'guest' });
    res.status(201).json(formatUser(user));
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id   (admin or the user themselves)
exports.updateUser = async (req, res, next) => {
  try {
    const isSelf = String(req.user._id) === req.params.id;
    if (!isSelf && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to do this' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, roomNumber, password, checkInDate, checkOutDate } = req.body;
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (roomNumber !== undefined) user.roomNumber = roomNumber;
    if (checkInDate !== undefined) user.checkInDate = checkInDate || undefined;
    if (checkOutDate !== undefined) user.checkOutDate = checkOutDate || undefined;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = password; // hashed automatically on save
    }
    await user.save();
    res.json(formatUser(user));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id   (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/staff   (admin)
exports.getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff' }).sort({ name: 1 });
    res.json(staff.map(formatUser));
  } catch (err) {
    next(err);
  }
};
