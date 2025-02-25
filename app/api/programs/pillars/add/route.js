import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Pillar from '@/app/models/pillar';

export async function POST (req, res) {
  console.log('route.js')
  const body = await req.json();
  console.log('route.js body:' , body)
  await connectDB();
  try{
    // check if there's an existing workout for the day
    const existingWorkout = await Pillar.findOne({ week: body.week, day: body.day });
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