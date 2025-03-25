'use server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Workout from '@/app/models/workout';
import Movement from '@/app/models/Movement';
import Pillar from '@/app/models/Pillar';
import { z } from "zod"
import bcrypt from "bcrypt"
import User from '@/app/models/User';
import jwt from "jsonwebtoken"

// This would typically connect to your database
// For this example, we're just simulating the database operation
const mockUserDatabase = []

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

async function signupUser(data) {
  await connectDB();
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

async function signinUser(state, formData) {
  // get Values
  const email = formData.get('email')
  const password = formData.get('password')

  await connectDB();
  try {
    // Check if user already exists
    const existingUser = await User.findOne({email: email})
    if  (!existingUser) {
      return {
        success: false,
        error: "Email or password is incorrect",
      }
    }
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Email or password is incorrect",}
    }
    // create json web token
    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return {
      success: true,
      token: token,
    }

  } catch (error) {
    console.error("Signup error:", error)

    return {
      success: false,
      error: "Failed to login",
    }
  }
}




async function createWorkout(workout) {
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

async function getMovements() {
  await connectDB();
  const movements = await Movement.find();
  if (!movements || movements.length === 0) {
    return { success: false, error: 'No movement found' };
  }
  return { success: true, data: movements };
}


async function getWorkout({program, week, day}) {
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

  
  export { getMovements, getWorkout, createWorkout, signinUser, signupUser }