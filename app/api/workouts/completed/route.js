import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import User from '@/models/User';
import Workout from '@/models/workout';
import Pillar from '@/models/Pillar';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    // Find the user and populate the completed workouts
    const user = await User.findById(userId).select('completed');
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get the workout IDs from the user's completed array
    const workoutIds = user.completed.map(item => item.pillarId);

    // Fetch the complete workout details
    const completedWorkouts = await Pillar.find({
      _id: { $in: workoutIds }
    }).sort({ program: 1, week: 1, day: 1 });

    // Add completion date to each workout
    const workoutsWithCompletionDate = completedWorkouts.map(workout => {
      const completionEntry = user.completed.find(
        item => item.pillarId.toString() === workout._id.toString()
      );
      
      return {
        ...workout.toObject(),
        completedAt: completionEntry ? completionEntry.completedAt : null
      };
    });

    return NextResponse.json({
      success: true,
      completedWorkouts: workoutsWithCompletionDate
    });
  } catch (error) {
    console.error('Error fetching completed workouts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
