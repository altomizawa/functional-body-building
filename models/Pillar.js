'use server'
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SectionSchema = new Schema({
  section: { type: String, required: false },
  icon: { type: String, required: false },
  description: {type: String, required: false},
  movements: [
    {
      type: { type: Schema.Types.ObjectId, ref: 'Movement' },
      link: String,
      name: String,
    },
  ],
  notes: { type: String, required: false },
});

const PillarSchema = new Schema({
  program: { type: String, required: false },
  week: { type: Number, required: false },
  day: { type: Number, required: false },
  sections: [SectionSchema]
});

const Pillar = mongoose.models.Pillar || mongoose.model('Pillar', PillarSchema);

export default Pillar;