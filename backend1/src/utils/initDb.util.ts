import mongoose from 'mongoose';
import User from '../models/user.model';
import dotenv from 'dotenv';
import connectDB from '../config/database';

dotenv.config();

/**
 * Initialize database with admin user
 */
const initializeDb = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@askfoundation.org' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@askfoundation.org',
      password: process.env.ADMIN_DEFAULT_PASSWORD || 'admin123',
      role: 'admin',
      isActive: true,
    });

    console.log('Admin user created:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run initialization
initializeDb();