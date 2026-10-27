const ServiceRequest = require('../models/ServiceRequest');
const HotelService = require('../models/HotelService');
const User = require('../models/User');
const { notifyUser, notifyAdmins } = require('../services/notificationService');

const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];
const PRIORITIES = ['Low', 'Medium', 'High'];

// Fill in guest, service and staff details
const populate = (query) =>
  query
    .populate('guestId', 'name email phone roomNumber')
    .populate('serviceId', 'serviceName category price')
    .populate('assignedStaff', 'name email phone');

const idOf = (v) => (v ? String(v._id || v) : null);

// Who is allowed to see a request?
const canView = (user, request) => {
  if (user.role === 'admin') return true;
  if (user.role === 'guest') return idOf(request.guestId) === String(user._id);
  return idOf(request.assignedStaff) === String(user._id); // staff
};

// POST /api/requests   (guest)
exports.createRequest = async (req, res, next) => {
  try {
    const { serviceId, roomNumber, description, priority } = req.body;
    if (!serviceId || !roomNumber || !description) {
      return res.status(400).json({ message: 'Service, room number and description are required' });
    }
    if (priority && !PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: 'Priority must be Low, Medium or High' });
    }
    const service = await HotelService.findById(serviceId);
    if (!service || !service.availability) {
      return res.status(400).json({ message: 'Invalid or unavailable service' });
    }
    const request = await ServiceRequest.create({
      guestId: req.user._id,
      serviceId,
      roomNumber,
      description,
      priority: priority || 'Medium',
    });
    await notifyAdmins(`New ${service.serviceName} request from room ${roomNumber}`, 'request');
    res.status(201).json(await populate(ServiceRequest.findById(request._id)));
  } catch (err) {
    next(err);
  }
};

// GET /api/requests   (guest: own, staff: assigned, admin: all)
exports.getRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'guest') filter.guestId = req.user._id;
    if (req.user.role === 'staff') filter.assignedStaff = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    const requests = await populate(ServiceRequest.find(filter).sort({ createdAt: -1 }));
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/:id
exports.getRequest = async (req, res, next) => {
  try {
    const request = await populate(ServiceRequest.findById(req.params.id));
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!canView(req.user, request)) {
      return res.status(403).json({ message: 'You do not have permission to view this request' });
    }
    res.json(request);
  } catch (err) {
    next(err);
  }
};

// PUT /api/requests/:id   (guest can cancel, staff can update status, admin can edit)
exports.updateRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id).populate('serviceId', 'serviceName');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!canView(req.user, request)) {
      return res.status(403).json({ message: 'You do not have permission to update this request' });
    }

    const { status, description, priority } = req.body;
    const role = req.user.role;
    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (role === 'guest') {
      if (status !== 'Cancelled') {
        return res.status(403).json({ message: 'Guests can only cancel requests' });
      }
      if (!['Pending', 'Assigned'].includes(request.status)) {
        return res.status(400).json({ message: 'Only pending or assigned requests can be cancelled' });
      }
    }
    if (role === 'staff') {
      if (!['In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ message: 'Staff can only set In Progress or Completed' });
      }
      if (['Completed', 'Cancelled'].includes(request.status)) {
        return res.status(400).json({ message: 'This request is already closed' });
      }
    }
    if (role === 'admin') {
      if (description) request.description = description;
      if (priority && PRIORITIES.includes(priority)) request.priority = priority;
    }

    const changed = status && status !== request.status;
    if (status) request.status = status;
    await request.save();

    const name = request.serviceId ? request.serviceId.serviceName : 'service';
    if (changed) {
      if (role !== 'guest') {
        await notifyUser(request.guestId, `Your ${name} request is now ${status}`, 'status');
      } else if (request.assignedStaff) {
        await notifyUser(
          request.assignedStaff,
          `Guest cancelled the ${name} request for room ${request.roomNumber}`,
          'status'
        );
      }
    }
    res.json(await populate(ServiceRequest.findById(request._id)));
  } catch (err) {
    next(err);
  }
};

// PUT /api/requests/:id/assign   (admin)
exports.assignRequest = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    if (!staffId) return res.status(400).json({ message: 'Staff ID is required' });

    const staff = await User.findOne({ _id: staffId, role: 'staff' });
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });

    const request = await ServiceRequest.findById(req.params.id).populate('serviceId', 'serviceName');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (['Completed', 'Cancelled'].includes(request.status)) {
      return res.status(400).json({ message: 'Closed requests cannot be assigned' });
    }

    request.assignedStaff = staff._id;
    request.status = 'Assigned';
    await request.save();

    const name = request.serviceId ? request.serviceId.serviceName : 'service';
    await notifyUser(staff._id, `New task assigned: ${name} for room ${request.roomNumber}`, 'request');
    await notifyUser(request.guestId, `Your ${name} request was assigned to ${staff.name}`, 'status');

    res.json(await populate(ServiceRequest.findById(request._id)));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/requests/:id   (admin)
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    next(err);
  }
};
