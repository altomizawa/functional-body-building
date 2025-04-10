import { verifySession } from '@/lib/session';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';

export async function GET() {
  try{
    await connectDB();
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Remove sensitive information before sending the response
    const { password, ...userWithoutPassword } = user.toObject();
  
    return NextResponse.json({ user: userWithoutPassword, success: true }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 });    
  }
}