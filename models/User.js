'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Simplified CompletedWorkout - only store what's needed
const CompletedWorkoutSchema = new Schema({
  pillarId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Pillar',
    required: true 
  },
  completedAt: { 
    type: Date, 
    default: Date.now
  }
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  completed:{type: [CompletedWorkoutSchema], required: true, default: []},
  role: { type: String, required: true, default: 'user' },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
