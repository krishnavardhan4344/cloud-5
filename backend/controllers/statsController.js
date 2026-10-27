const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');

// GET /api/stats   (admin)
exports.getStats = async (req, res, next) => {
  try {
    const [totalGuests, totalStaff, requests] = await Promise.all([
      User.countDocuments({ role: 'guest' }),
      User.countDocuments({ role: 'staff' }),
      ServiceRequest.find().populate('serviceId', 'category'),
    ]);

    const count = (s) => requests.filter((r) => r.status === s).length;
    const pending = count('Pending');
    const assigned = count('Assigned');
    const inProgress = count('In Progress');
    const completed = count('Completed');
    const cancelled = count('Cancelled');

    // Requests by service category
    const byCat = {};
    requests.forEach((r) => {
      const c = r.serviceId ? r.serviceId.category : 'Other';
      byCat[c] = (byCat[c] || 0) + 1;
    });
    const byService = Object.entries(byCat).map(([name, value]) => ({ name, value }));

    // Requests per day for the last 7 days
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      daily.push({
        date: key.slice(5),
        requests: requests.filter((r) => r.createdAt.toISOString().slice(0, 10) === key).length,
      });
    }

    res.json({
      totalGuests,
      totalStaff,
      active: pending + assigned + inProgress,
      pending,
      completed,
      cancelled,
      byService,
      daily,
      statusChart: [
        { name: 'Pending', value: pending },
        { name: 'Assigned', value: assigned },
        { name: 'In Progress', value: inProgress },
        { name: 'Completed', value: completed },
        { name: 'Cancelled', value: cancelled },
      ],
    });
  } catch (err) {
    next(err);
  }
};
