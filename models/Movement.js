import mongoose from 'mongoose';
const { Schema } = mongoose;

const movementSchema = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const  Movement = mongoose.models.Movement || mongoose.model('Movement', movementSchema);

export default Movement;