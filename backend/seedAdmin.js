const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@roadtracker.com' });
    
    if (adminExists) {
      console.log('Admin user already exists in database');
    } else {
      await User.create({
        name: 'Super Administrator',
        email: 'admin@roadtracker.com',
        password: 'adminpassword123',
        role: 'admin'
      });
      console.log('Admin user successfully seeded into database!');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
