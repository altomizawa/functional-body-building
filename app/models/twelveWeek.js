'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SectionSchema = new Schema({
  section: { type: String, required: false },
  icon: { type: String, required: false },
  description: String,
  notes: { type: String, required: false },
});

const TwelveWeekSchema = new Schema({
  program: { type: String, required: false },
  week: { type: Number, required: false },
  day: { type: Number, required: false },
  sections: [SectionSchema]
});

const TwelveWeek = mongoose.models.TwelveWeek || mongoose.model('TwelveWeek', TwelveWeekSchema);

export default TwelveWeek;