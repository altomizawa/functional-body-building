'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define a CompletedWorkoutSchema to store completion details
const CompletedWorkoutSchema = new Schema({
  pillarId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pillar',
    required: true 
  },
  program: { type: String, required: true },
  week: { type: Number, required: true },
  day: { type: Number, required: true },
  completedAt: { 
    type: Date, 
    default: Date.now,
    required: true 
  }
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  // completed: [CompletedWorkoutSchema],
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
