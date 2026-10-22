import mongoose from 'mongoose';
const { Schema } = mongoose;

const CompletedDaySchema = new Schema(
  {
    dayId: { type: Number, required: true },
    completedDate: { type: String, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MovementDataSchema = new Schema(
  {
    current1RM: { type: Number, default: 0 },
    previous1RM: { type: Number, default: 0 },
    weeklyJump: { type: Number, default: 0 }, // 0 means use movement default (10 lbs for squat, 5 lbs for bench)
    completedDays: { type: [CompletedDaySchema], default: [] },
  },
  { _id: false }
);

const SmolovJrSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    unit: {
      type: String,
      enum: ['lbs', 'kg'],
      default: 'lbs',
    },
    activeMovement: {
      type: String,
      enum: ['back-squat', 'bench-press'],
      default: 'back-squat',
    },
    backSquat: {
      type: MovementDataSchema,
      default: () => ({
        current1RM: 0,
        previous1RM: 0,
        weeklyJump: 10,
        completedDays: [],
      }),
    },
    benchPress: {
      type: MovementDataSchema,
      default: () => ({
        current1RM: 0,
        previous1RM: 0,
        weeklyJump: 5,
        completedDays: [],
      }),
    },
  },
  { timestamps: true }
);

const SmolovJr = mongoose.models.SmolovJr || mongoose.model('SmolovJr', SmolovJrSchema);

export default SmolovJr;
