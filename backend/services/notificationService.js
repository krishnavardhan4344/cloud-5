const Notification = require('../models/Notification');
const User = require('../models/User');

const notifyUser = (userId, message, type = 'info') =>
  Notification.create({ userId, message, type });

const notifyAdmins = async (message, type = 'info') => {
  const admins = await User.find({ role: 'admin' }).select('_id');
  await Promise.all(admins.map((a) => notifyUser(a._id, message, type)));
};

module.exports = { notifyUser, notifyAdmins };
