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
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    lowercase: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true 
  },
  password: {
    type: String,
    required: true 
  },
  avatar: { type: String },
  completed:{
    type: [CompletedWorkoutSchema],
    required: true,
    default: []
  },
  role: {
    type: String, 
    required: true, 
    default: 'user', 
    enum: ['user', 'admin'] 
  },
  status: {
    type: String,
    required: true,
    default: 'active', 
    enum: ['active', 'inactive', 'expired'] 
  },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
