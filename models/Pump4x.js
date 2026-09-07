'use server'
import mongoose from 'mongoose';
import Movement from '@/models/Movement';
const { Schema } = mongoose;

const SectionSchema = new Schema({
  section: { type: String, required: false },
  icon: { type: String, required: false },
  description: { type: String, required: false },
  movements: [
    {
      type: { type: Schema.Types.ObjectId, ref: 'Movement' },
      link: String,
      name: String,
    },
  ],
  notes: { type: String, required: false },
});

const Pump4xSchema = new Schema({
  program: { type: String, required: false },
  cycle: { type: String, required: true },
  date: { type: Date, required: true },
  week: { type: Number, required: false },
  day: { type: Number, required: false },
  sections: [SectionSchema]
}, { collection: 'pump4x' });

const Pump4x = mongoose.models.Pump4x || mongoose.model('Pump4x', Pump4xSchema, 'pump4x');

export default Pump4x;
