'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const Exercise = mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);

export default Exercise;