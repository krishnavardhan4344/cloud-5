const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelService', required: true },
    roomNumber: { type: String, required: [true, 'Room number is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
