'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SectionSchema = new Schema({
  section: { type: String, required: false },
  icon: { type: String, required: false },
  description: String,
  videoDemo: [String],
  notes: { type: String, required: false },
});

const WorkoutSchema = new Schema({
  date: { type: Date, required: false},
  program: { type: String, required: false },
  week: { type: Number, required: false },
  day: { type: Number, required: false },
  sections: [SectionSchema]
});

const Workout = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
// const Pillar = mongoose.model('Pillar', PillarSchema);

export default Workout;