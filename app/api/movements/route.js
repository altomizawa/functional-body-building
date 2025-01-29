import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Movements from '@/app/models/movementList';

// POST NEW MOVEMENT
export async function POST(req) {
  const body = await req.json();
  const { name, link } = body;

  await connectDB();
  try {
    const existingMovement = await Movements.findOne({ name: name.toLowerCase() });
    if (existingMovement) {
      return NextResponse.json({ error: 'Movement already exists' }, { status: 400 });
    }
    console.log( 'fine until here')
    const newMovement = await Movements.create(
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
    const movements = await Movements.find().sort({ name: 1 });
    return NextResponse.json(movements);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
  }
}