// createAdmin.js
const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smp-pgri');
    
    console.log('✅ Connected to MongoDB');
    
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Reset password? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          existingAdmin.password = 'admin123';
          await existingAdmin.save();
          console.log('✅ Password reset to: admin123');
        }
        readline.close();
        process.exit(0);
      });
      return;
    }
    
    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('🎉 Admin created!');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();