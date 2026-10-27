exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    status = 400;
    message = 'Email is already registered';
  }
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }
  if (status === 500) {
    console.error(err);
    message = 'Something went wrong on the server';
  }
  res.status(status).json({ message });
};
