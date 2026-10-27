const HotelService = require('../models/HotelService');

exports.getServices = async (req, res, next) => {
  try {
    res.json(await HotelService.find().sort({ category: 1, serviceName: 1 }));
  } catch (err) {
    next(err);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const { serviceName, category } = req.body;
    if (!serviceName || !category) {
      return res.status(400).json({ message: 'Service name and category are required' });
    }
    res.status(201).json(await HotelService.create(req.body));
  } catch (err) {
    next(err);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await HotelService.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await HotelService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
};
