import connectDB from '@/lib/database/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createSession } from '@/lib/session';
import { jwt } from "jsonwebtoken";
import User from '@/app/models/User';
import { redirect } from 'next/dist/server/api-utils';

export async function POST(req) {
 
  // get Values
  const body = await req.json();
  const { email, password } = body;

  await connectDB();
  try {
    // Check if user already exists
    const existingUser = await User.findOne({email: email})
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
    };
    await createSession(sanitizedUser) 
    // create json web token
    // const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return NextResponse.json({ message: 'New Session Created',  success: true }, { status: 200 });

  } catch (error) {
    console.error("Signup error:", error.message)

    return NextResponse.json({ error: error.message,  success: false }, { status: 404 });
  }
}