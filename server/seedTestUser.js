const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const hashed = await bcrypt.hash('1234', 10);
    const existing = await User.findOne({ email: 'user1@example.com' });

    if (existing) {
      existing.password = hashed;
      existing.name = 'Test User';
      existing.role = 'user';
      await existing.save();
      console.log('✅ User updated: user1@example.com');
    } else {
      await User.create({
        name: 'Test User',
        email: 'user1@example.com',
        password: hashed,
        role: 'user'
      });
      console.log('✅ User created: user1@example.com');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();
