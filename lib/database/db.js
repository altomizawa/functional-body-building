import mongoose from 'mongoose';
import '@/models/User';
import '@/models/Pillar';
import '@/models/Pump4x';
import '@/models/Movement';
import '@/models/workout';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "functional_bodybuilding",
    });
    console.log('database connected');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}