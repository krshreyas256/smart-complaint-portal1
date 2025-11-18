const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

const MONGO = process.env.MONGO_URI;

const seed = async () => {
  if (!MONGO) {
    console.error('MONGO_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO);
  console.log('Connected to MongoDB for seeding');

  const users = [
    { name: 'John', email: 'user@example.com', password: 'password123', role: 'user' },
    { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      existing.name = u.name;
      existing.password = hashed;
      existing.role = u.role;
      await existing.save();
      console.log('Updated user:', u.email);
    } else {
      await User.create({ name: u.name, email: u.email, password: hashed, role: u.role });
      console.log('Created user:', u.email);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
