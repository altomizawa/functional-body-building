
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
<<<<<<< HEAD
import Movement from '@/app/models/movement';

=======
import Movement from '@/app/models/Movement.js';
import { verifySession, createSession } from '@/lib/session';
>>>>>>> dev

// POST NEW MOVEMENT
export async function POST(req) {
  const isThereSession = await verifySession();
  if (!isThereSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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
export async function GET(req) {
  await connectDB();
  // const isThereSession = await verifySession();
  // if (!isThereSession) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
  try {
<<<<<<< HEAD
    const movements = await Movement.find().sort({ name: 1 });
    return NextResponse.json(movements);
=======
    const exercises = await Movement.find().sort({ name: 1 });
    return NextResponse.json(exercises, { status: 200 });
>>>>>>> dev
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
  }
}
