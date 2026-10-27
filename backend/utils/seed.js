require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const HotelService = require('../models/HotelService');
const ServiceRequest = require('../models/ServiceRequest');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysAhead = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing old data...');
  await Promise.all([
    User.deleteMany(), HotelService.deleteMany(), ServiceRequest.deleteMany(),
    Feedback.deleteMany(), Notification.deleteMany(),
  ]);

  // Users (passwords are hashed automatically by the model)
  const admin = await User.create({ name: 'Alex Admin', email: 'admin@hotel.com', password: 'admin123', phone: '9000000001', role: 'admin' });

  const staff = [];
  for (const [name, email, phone] of [
    ['Sam Staff', 'staff1@hotel.com', '9000000011'],
    ['Priya Staff', 'staff2@hotel.com', '9000000012'],
    ['Ravi Staff', 'staff3@hotel.com', '9000000013'],
  ]) {
    staff.push(await User.create({ name, email, password: 'staff123', phone, role: 'staff' }));
  }

  const guests = [];
  const guestData = [
    ['Anita Guest', 'guest1@hotel.com', '9100000001', '101'],
    ['Bob Guest', 'guest2@hotel.com', '9100000002', '102'],
    ['Carol Guest', 'guest3@hotel.com', '9100000003', '103'],
    ['David Guest', 'guest4@hotel.com', '9100000004', '104'],
    ['Emma Guest', 'guest5@hotel.com', '9100000005', '105'],
  ];
  for (const [name, email, phone, roomNumber] of guestData) {
    guests.push(await User.create({
      name, email, password: 'guest123', phone, roomNumber, role: 'guest',
      checkInDate: daysAgo(2), checkOutDate: daysAhead(3),
    }));
  }

  // 8 hotel services
  const s = await HotelService.insertMany([
    { serviceName: 'Room Cleaning', description: 'Full room cleaning and bed making', category: 'Housekeeping', price: 0 },
    { serviceName: 'Towel & Linen Change', description: 'Fresh towels and bed linen', category: 'Housekeeping', price: 0 },
    { serviceName: 'Breakfast in Room', description: 'Continental breakfast served to your room', category: 'Room Service', price: 15 },
    { serviceName: 'Laundry Pickup', description: 'Wash and fold, returned in 24 hours', category: 'Laundry', price: 10 },
    { serviceName: 'Restaurant Order', description: 'Order from our restaurant menu', category: 'Food', price: 25 },
    { serviceName: 'AC / Electrical Repair', description: 'Air conditioning, lights, TV and sockets', category: 'Maintenance', price: 0 },
    { serviceName: 'Airport Taxi', description: 'Airport pickup or drop', category: 'Transport', price: 30 },
    { serviceName: 'Extra Pillows & Toiletries', description: 'Extra amenities delivered to your room', category: 'Amenities', price: 0 },
  ]);

  // Sample requests
  const reqs = await ServiceRequest.create([
    { guestId: guests[0]._id, serviceId: s[0]._id, roomNumber: '101', description: 'Please clean the room after 2 PM', priority: 'Medium', status: 'Pending', createdAt: daysAgo(0) },
    { guestId: guests[1]._id, serviceId: s[2]._id, roomNumber: '102', description: 'Breakfast for two at 8 AM', priority: 'Low', status: 'Assigned', assignedStaff: staff[0]._id, createdAt: daysAgo(1) },
    { guestId: guests[2]._id, serviceId: s[5]._id, roomNumber: '103', description: 'Air conditioner is not cooling', priority: 'High', status: 'In Progress', assignedStaff: staff[1]._id, createdAt: daysAgo(1) },
    { guestId: guests[3]._id, serviceId: s[3]._id, roomNumber: '104', description: 'Three shirts and two trousers', priority: 'Medium', status: 'Completed', assignedStaff: staff[2]._id, createdAt: daysAgo(3) },
    { guestId: guests[4]._id, serviceId: s[6]._id, roomNumber: '105', description: 'Taxi to the airport tomorrow 6 AM', priority: 'High', status: 'Completed', assignedStaff: staff[0]._id, createdAt: daysAgo(2) },
    { guestId: guests[0]._id, serviceId: s[7]._id, roomNumber: '101', description: 'Two extra pillows please', priority: 'Low', status: 'Completed', assignedStaff: staff[1]._id, createdAt: daysAgo(4) },
    { guestId: guests[1]._id, serviceId: s[4]._id, roomNumber: '102', description: 'Dinner order - veg biryani', priority: 'Medium', status: 'Cancelled', createdAt: daysAgo(5) },
    { guestId: guests[2]._id, serviceId: s[1]._id, roomNumber: '103', description: 'Change towels', priority: 'Low', status: 'Pending', createdAt: daysAgo(0) },
  ]);

  await Feedback.create([
    { guestId: guests[3]._id, rating: 5, comment: 'Laundry was quick and neat. Great service!' },
    { guestId: guests[4]._id, rating: 4, comment: 'Taxi arrived on time.' },
    { guestId: guests[0]._id, rating: 5, comment: 'Friendly staff and quick delivery.' },
  ]);

  await Notification.create([
    { userId: guests[1]._id, message: 'Your Breakfast in Room request was assigned to Sam Staff', type: 'status' },
    { userId: guests[3]._id, message: 'Your Laundry Pickup request is now Completed', type: 'status' },
    { userId: staff[0]._id, message: 'New task assigned: Breakfast in Room for room 102', type: 'request' },
    { userId: admin._id, message: 'New Room Cleaning request from room 101', type: 'request' },
  ]);

  console.log(`Seed complete: ${guests.length} guests, ${staff.length} staff, 1 admin, ${s.length} services, ${reqs.length} requests`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
