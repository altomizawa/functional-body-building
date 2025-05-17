'use server'
import connectDB from '@/lib/database/db';
import { z } from "zod"
import bcrypt from "bcrypt"
import User from '@/models/User';
import { deleteSession, createSession, verifySessionForRequests } from './session';
import Pillar from '@/models/Pillar';
import Movement from '@/models/Movement';
import CustomError from './error';
import { redirect } from 'next/navigation';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})



// ------------------------------ SIGN UP ------------------------------

export async function signupUser(data) {
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

    // Create a new user 
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




// ------------------------ SIGN IN ----------------------------  

export async function signinUserAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  await connectDB();
  try {
    // Check if user already exists
    const existingUser = await User.findOne({email: email}).select('+password');
    if  (!existingUser) {
      throw new Error("Email or password is incorrect")
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      throw new Error("Email or password is incorrect")
    }
  
    // Create a session for the user
    const sanitizedUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      status: existingUser.status,
    };
    await createSession(sanitizedUser) 

    return {
      success: true,
      user: sanitizedUser,
    }

  } catch (error) {
    console.log("Signup error:", error.message)

    return {error: error.message, status: 404};
  }
}

// ---------------------------- LOGOUT ----------------------------

export async function logout () {
  await deleteSession();
  redirect('/login')
  return { message: 'Logged out', status: 200 };
}