'use server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/workout';
import Movement from '@/app/models/Movement';

export async function getCurrentWorkout(date) {
  await connectDB();

  try {
    const dailyWorkout = await Workout.findOne({ date: date }); 

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

export async function getMovements() {

  try {
    const res = await fetch('/api/movements',
      {method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      }
    )
    if (!movements) {
      return NextResponse.json({ error: 'No movements found' }, { status:
      404 });
    }
    const movements = await res.json();
    console.log(movements)
    return NextResponse.json(movements);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
  }
}


export async function getTwelveWeekWorkout({week: week, day: day}) {
  await connectDB();

  try {
    const twelveWeekWorkout = await Workout.findOne({ week: week, day: day }); 

    return NextResponse.json(twelveWeekWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}