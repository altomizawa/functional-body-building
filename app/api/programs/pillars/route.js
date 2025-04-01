import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Pillar from '@/models/Pillar';


export async function POST (req, res) {
  const body = await req.json();
<<<<<<< HEAD
=======
  console.log('this is the body', body)
>>>>>>> dev
  await connectDB();
  try{
    // check if there's an existing workout for the day
    const currentWorkout = await Pillar.findOne({ program:body.program, week: body.week, day: body.day });
    if (currentWorkout) {
      // if workout exists, return error
      return NextResponse.json(currentWorkout);
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch workouts", status: 500 });
  }
}