const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Only send safe fields to the client (never the password)
const formatUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  roomNumber: u.roomNumber,
  checkInDate: u.checkInDate,
  checkOutDate: u.checkOutDate,
  createdAt: u.createdAt,
});

module.exports = { generateToken, formatUser };
