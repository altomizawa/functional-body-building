
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

// MODIFY MOVEMENT
export async function PATCH (req) {
  const body = await req.json();
  const { id, name, link } = body;
  await connectDB();
  try {
    const updatedMovement = await Movement.findByIdAndUpdate(id, { name, link }, { new: true });
    if (!updatedMovement) {
      return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
    }
    return NextResponse.json(updatedMovement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update movement' }, { status: 500 });
  }
}