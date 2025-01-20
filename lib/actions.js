import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/workout';
import Pillar from '@/app/models/workout';

export async function getCurrentWorkout() {
  await connectDB();

  try {
    const dailyWorkout = await Pillar.findOne({ day: 2 });
    console.log(dailyWorkout)
    return NextResponse.json(dailyWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function createWorkout(workout) {
  await connectDB();
  try {
    const newWorkout = new Workout(workout);
    await newWorkout.save();
    return NextResponse.json(newWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
}
