const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function updateLogoPaths() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users with logos that don't start with '/'
    const users = await User.find({ 'profile.logo': { $exists: true, $ne: null, $not: /^\/.*/ } });

    console.log(`Found ${users.length} users with logos to update`);

    for (const user of users) {
      if (user.profile.logo && !user.profile.logo.startsWith('/')) {
        user.profile.logo = '/' + user.profile.logo;
        await user.save();
        console.log(`Updated logo path for user ${user._id}: ${user.profile.logo}`);
      }
    }

    console.log('Logo paths updated successfully');
  } catch (error) {
    console.error('Error updating logo paths:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateLogoPaths();
