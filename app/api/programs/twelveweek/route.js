import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/Workout';

export async function GET() {
  console.log('GET request received');
  const body = await req.json();
  console.log('this is the body: ', body)
  await connectDB();
  try {
    const workouts = await TwelveWeek.find();
    // console.log('this is the daily workout: ', dailyWorkout)
    return NextResponse.json(workouts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}





