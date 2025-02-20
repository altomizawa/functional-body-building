import { NextResponse } from 'next/server'
import connectDB from '@/lib/database/db'
import Workout from '@/app/models/Workout'

export async function POST(req) {
  await connectDB()
  const body = await req.json()
  const { date } = body

  try {
    const dailyWorkout = await Workout.findOne({date: new Date(date)})
    if (!dailyWorkout) {
      return NextResponse.json({ error: 'No workout found for the given date' }, { status: 404 })
    }
    return NextResponse.json(dailyWorkout)
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 })
  }
}

