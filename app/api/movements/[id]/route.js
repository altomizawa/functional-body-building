import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Exercise from '@/app/models/Movement';

export async function PATCH ({params}) {
  const { id } = params;


  console.log(id, name, link)
  // await connectDB();
  // try {
  //   const updatedMovement = await Movement.findByIdAndUpdate(id, { name, link }, { new: true });
  //   if (!updatedMovement) {
  //     return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
  //   }
  //   return NextResponse.json(updatedMovement);
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json({ error: 'Failed to update movement' }, { status: 500 });
  // }
}
