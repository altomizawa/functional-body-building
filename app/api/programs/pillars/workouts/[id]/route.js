import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/workout';
import Pillar from '@/app/models/workout';

// export async function GET (request, {params}) {
//   await connectDB();
//   const slug = (await params).id
//   try{
//     const workout = await Workout.findOne({_id: slug});
//     return NextResponse.json(workout);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
//   }
// }


export async function GET(req, {params}) {
  const slug = (await params).id
  await connectDB();
  try {
    // const dailyWorkout = await Workout.findOne({date: new Date(slug)});
    console.log(slug)
    const dailyWorkout = await Workout.findOne(
      { "workout.exercises._id": slug},
      { "workout.exercises.$": 1, _id: 1 }
    );
    return NextResponse.json(dailyWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

