import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Pillar from '@/app/models/Pillar';

export async function POST (req, res) {
  const body = await req.json();
  await connectDB();
  try{
    // check if there's an existing workout for the day
    const existingWorkout = await Pillar.findOne({ program: body.program, week: body.week, day: body.day });
    if (existingWorkout) {
      // if workout exists, return error
      return NextResponse.json({ message: "There's already a current workout on this date", status: 404 });
    } else {
      const addedWorkout = await Pillar.create(body);
      return NextResponse.json(addedWorkout);
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch workouts", status: 500 });
  }
}