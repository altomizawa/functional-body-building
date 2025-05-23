import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Movement from '@/models/Movement.js';
import { verifySession } from '@/lib/session';

export async function GET(req, { params }) {
  const { id } = await params // 'a', 'b', or 'c'
  return NextResponse.json({ id });
}


// MODIFY MOVEMENT
export async function PATCH (req, { params }) {
  const isThereSession = await verifySession();
  if (!isThereSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, link } = body;
  const { id } = await params 

  await connectDB();
  try {
    const updatedMovement = await Movement.findByIdAndUpdate(id, { name, link }, { new: true });
    if (!updatedMovement) {
      throw new Error({ error: 'Movement not found' }, { status: 404 });
    }
    return NextResponse.json(updatedMovement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update movement' }, { status: 500 });
  }
}

// DELETE MOVEMENT
export async function DELETE (req, { params }) {
  const { id } = await params;

  await connectDB();
  try{
    const deletedMovement = await Movement.findByIdAndDelete(id);
    if (!deletedMovement) {
      throw new Error({ error: 'Movement not found' }, { status: 404 });
    }
    return NextResponse.json(deletedMovement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete movement' }, { status: 500 });
  }
}