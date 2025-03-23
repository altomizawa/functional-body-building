
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Movement from '@/app/models/Movement.js';


// POST NEW MOVEMENT
export async function POST(req) {
  const body = await req.json();
  const { name, link } = body;

  await connectDB();
  try {
    const existingMovement = await Movement.findOne({ name: name.toLowerCase() });
    if (existingMovement) {
      return NextResponse.json({ error: 'Movement already exists' }, { status: 400 });
    }
    console.log( 'fine until here')
    const newMovement = await Movement.create(
      {
        name: name.toLowerCase(),
        link: link
      });
    return NextResponse.json(newMovement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
  }
}

// GET ALL MOVEMENTS
export async function GET() {
  await connectDB();
  try {
    const exercises = await Movement.find().sort({ name: 1 });
    return NextResponse.json(exercises, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
  }
}