'use server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/workout';
import Movement from '@/app/models/Movement';
import Pillar from '@/app/models/Pillar';
import { z } from "zod"
import bcrypt from "bcrypt"
import User from '@/app/models/User';

// This would typically connect to your database
// For this example, we're just simulating the database operation
const mockUserDatabase = []

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function signupUser(data) {
  try {
    // Validate the input data
    const validatedData = userSchema.parse(data)
    // Check if user already exists
    const existingUser = await User.findOne({email: validatedData.email})
    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists",
      }
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds)

    // Create a new user (in a real app, this would save to a database)
    const newUser = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    }

    // Add user to our mock database
    const user = await User.create(newUser)
    if(!user) {
      return {
        success: false,
        error: "Failed to create account",
      }
    }
    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid data provided",
      }
    }

    return {
      success: false,
      error: "Failed to create account",
    }
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
  const response = await fetch('http://localhost:3000/api/movements', {
    method: 'GET'
  })
  const data = await response.json()
  return data
}

export async function getWorkout({program, week, day}) {
  try {
    const response = await Pillar.findOne({ program: program, week: week, day: day }); 
    if (!response) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }
    return response
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }}