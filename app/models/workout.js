'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  name: { type: String, required: false },
  description: { type: String, required: false },
  video: { type: String, required: false }
});

const SectionSchema = new Schema({
  section: { type: String, required: false },
  icon: { type: String, required: false },
  exercises: [ExerciseSchema],
  notes: { type: String, required: false }
});

const PillarSchema = new Schema({
  date: { type: Date, required: false, unique: true },
  program: { type: String, required: false },
  week: { type: Number, required: false },
  day: { type: Number, required: false },
  workout: [SectionSchema]
});

const Pillar = mongoose.models.Pillar || mongoose.model('Pillar', PillarSchema);
// const Pillar = mongoose.model('Pillar', PillarSchema);

export default Pillar;