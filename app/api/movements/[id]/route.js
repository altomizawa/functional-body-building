import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
// import Movements from '../../models/movementList';

export async function GET( {params} ) {
  const id = (await params).id
  console.log('this is the params: ', id)

  return NextResponse.json({ message: 'GET /api/movements/[id]' });
  // await connectDB();
  // try {
  //   const dailyWorkout = await Workout.findOne({date: new Date(body)});
  //   return NextResponse.json(dailyWorkout);
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  // }
}
export async function PATCH(req, res) {
  const body = await req.json();
  console.log('this is the body: ', {name: name, link: link})
  
  await connectDB();
  try {
    const dailyWorkout = await Workout.findOne({date: new Date("2012-01-26")});
    return NextResponse.json(dailyWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}
