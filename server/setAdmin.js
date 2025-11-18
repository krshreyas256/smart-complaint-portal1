const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const promote = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      console.log('Admin user not found');
      process.exit(1);
    }
    user.role = 'admin';
    await user.save();
    console.log('User promoted to admin:', user.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

promote();
