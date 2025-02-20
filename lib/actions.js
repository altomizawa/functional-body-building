'use server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/Workout';

export async function getCurrentWorkout(date) {
  await connectDB();

  try {
    const dailyWorkout = await Workout.findOne({ date: "2025-02-04" });
    console.log('the date requested is:', date)
    console.log('the workout is:', dailyWorkout)
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
