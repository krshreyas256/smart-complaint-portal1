const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

const MONGO = process.env.MONGO_URI;

const gen = async () => {
  if (!MONGO) {
    console.error('MONGO_URI is not set in .env');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not set in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO);

  const emails = ['user@example.com', 'admin@example.com'];
  for (const email of emails) {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      continue;
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(`${email} token:`);
    console.log(token);
    console.log('---');
  }
  process.exit(0);
};

gen().catch(err => { console.error(err); process.exit(1); });
