const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'ADMIN',
};

const seedAdmin = async () => {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not set in .env file');
      process.exit(1);
    }

    // Connect to database
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { role: 'ADMIN' },
        { email: DEFAULT_ADMIN.email },
        { username: DEFAULT_ADMIN.username },
      ],
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // Ask if user wants to reset password
      const args = process.argv.slice(2);
      if (args.includes('--reset-password')) {
        console.log('🔄 Resetting admin password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('✅ Password reset successfully!');
        console.log(`   New password: ${DEFAULT_ADMIN.password}`);
      }
      
      await mongoose.disconnect();
      process.exit(0);
    }

    // Validate default admin data
    if (!DEFAULT_ADMIN.username || !DEFAULT_ADMIN.email || !DEFAULT_ADMIN.password) {
      throw new Error('Default admin credentials are incomplete');
    }

    // Check if username or email already exists (but not as admin)
    const existingUser = await User.findOne({
      $or: [
        { email: DEFAULT_ADMIN.email },
        { username: DEFAULT_ADMIN.username },
      ],
    });

    if (existingUser && existingUser.role !== 'ADMIN') {
      throw new Error(
        `A user with email ${DEFAULT_ADMIN.email} or username ${DEFAULT_ADMIN.username} already exists with role ${existingUser.role}`
      );
    }

    // Create admin user
    console.log('🔄 Creating admin user...');

    const admin = await User.create({
      username: DEFAULT_ADMIN.username,
      email: DEFAULT_ADMIN.email,
      password: DEFAULT_ADMIN.password,
      role: DEFAULT_ADMIN.role,
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Login Credentials:');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log(`   Role:     ${admin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding admin:', error.message);
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error('   Duplicate key error: A user with this email or username already exists.');
    } else if (error.name === 'ValidationError') {
      console.error('   Validation error:', Object.values(error.errors).map(e => e.message).join(', '));
    }
    
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

seedAdmin();