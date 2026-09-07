import mongoose from 'mongoose';
import Pillar from '@/models/Pillar';
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
    required: true,
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
    required: true,
    trim: true,
    select: false
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
  TwoFAToken: { type: String, default: null },
  TwoFATokenExpires: { type: Date, default: null },
  passkeys: {
    type: [
      new Schema({
        credentialID: { type: String, required: true },
        credentialPublicKey: { type: String, required: true },
        counter: { type: Number, required: true, default: 0 },
        credentialDeviceType: { type: String, required: true },
        credentialBackedUp: { type: Boolean, required: true },
        transports: [{ type: String }],
        name: { type: String, default: 'Passkey' },
        createdAt: { type: Date, default: Date.now },
        lastUsedAt: { type: Date, default: Date.now },
      })
    ],
    default: []
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
