import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/workout';


export async function POST(req) {
  console.log(req)
  const body = await req.json();
  console.log('this is the body: ', body)
  await connectDB();
  try {
    const dailyWorkout = await Workout.findOne({date: new Date(body.date)});
    // console.log('this is the daily workout: ', dailyWorkout)
    return NextResponse.json(dailyWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function PATCH(req, res) {
  const body = await req.json();
  console.log('this is the body: ', body)
  
  await connectDB();
  try {
    const dailyWorkout = await Workout.findOne({date: new Date("2012-01-26")});
    return NextResponse.json(dailyWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}