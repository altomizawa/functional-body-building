'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

const MovementSchema = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const Movements = mongoose.models.Movements || mongoose.model('Movements', MovementSchema);

export default Movements;