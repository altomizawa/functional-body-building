'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

const MovementSchema = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const Movement = mongoose.models.Movement || mongoose.model('Movement', MovementSchema);

export default Movement;