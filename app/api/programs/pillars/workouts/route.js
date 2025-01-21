import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/workout';
import Pillar from '@/app/models/workout';

export async function POST (req, res) {
   const body = await req.json();
  console.log('this is the body: ', body)
  await connectDB();
  try{
    const addedWorkout = await Workout.create(body);
    return NextResponse.json(addedWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
  // return NextResponse.json({ message: 'POST /api/programs/pillars/workouts' });
  //   try {
  //   if (method === 'POST') {
  //     const newWorkout = new Workout(body)
  //     const addedWorkout = await Workout.create(newWorkout);
  //     return NextResponse.json(addedWorkout);
  //   }
  //   const dailyWorkout = await Workout.findOne();
  //   return NextResponse.json(dailyWorkout);
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  // }
}


