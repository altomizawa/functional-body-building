'use server'

import connectDB from '@/lib/database/db';
import SmolovJr from '@/models/SmolovJr';
import { verifySessionForRequests } from './session';
import CustomError from './error';
import { revalidatePath } from 'next/cache';

function formatDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export async function getSmolovData(userId) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session) {
      throw new CustomError('User is not authenticated', 401);
    }

    const targetUserId = userId || session.user.id;
    let program = await SmolovJr.findOne({ userId: targetUserId });

    if (!program) {
      program = await SmolovJr.create({
        userId: targetUserId,
        unit: 'lbs',
        activeMovement: 'back-squat',
        backSquat: {
          current1RM: 0,
          previous1RM: 0,
          weeklyJump: 10,
          completedDays: [],
        },
        benchPress: {
          current1RM: 0,
          previous1RM: 0,
          weeklyJump: 5,
          completedDays: [],
        },
      });
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(program)),
    };
  } catch (error) {
    console.error('Error fetching Smolov Jr data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch Smolov Jr data',
    };
  }
}

export async function updateSmolov1RM({ movement, new1RM, weeklyJump, unit }) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session?.user?.id) {
      throw new CustomError('User is not authenticated', 401);
    }

    const userId = session.user.id;
    let program = await SmolovJr.findOne({ userId });

    if (!program) {
      program = new SmolovJr({ userId });
    }

    const movKey = movement === 'bench-press' ? 'benchPress' : 'backSquat';
    const parsed1RM = Number(new1RM);

    if (isNaN(parsed1RM) || parsed1RM < 0) {
      throw new CustomError('Invalid 1RM. Must be a valid positive number.', 400);
    }

    // Previous 1RM starts as 0. When user inserts a new 1RM,
    // current 1RM goes to previous and recently added is current 1RM.
    const oldCurrent = program[movKey]?.current1RM ?? 0;
    program[movKey].previous1RM = oldCurrent;
    program[movKey].current1RM = parsed1RM;

    if (weeklyJump !== undefined && weeklyJump !== null && !isNaN(Number(weeklyJump))) {
      const parsedJump = Number(weeklyJump);
      if (parsedJump >= 0) {
        program[movKey].weeklyJump = parsedJump;
      }
    }

    if (unit && ['lbs', 'kg'].includes(unit.toLowerCase())) {
      program.unit = unit.toLowerCase();
    }

    if (movement) {
      program.activeMovement = movement;
    }

    await program.save();
    revalidatePath('/programs/smolovjr');

    return {
      success: true,
      data: JSON.parse(JSON.stringify(program)),
    };
  } catch (error) {
    console.error('Error updating Smolov Jr 1RM:', error);
    return {
      success: false,
      error: error.message || 'Failed to update 1RM',
    };
  }
}

export async function toggleSmolovDayCompletion({ movement, dayId }) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session?.user?.id) {
      throw new CustomError('User is not authenticated', 401);
    }

    const userId = session.user.id;
    let program = await SmolovJr.findOne({ userId });

    if (!program) {
      program = await SmolovJr.create({ userId });
    }

    const movKey = movement === 'bench-press' ? 'benchPress' : 'backSquat';
    const dayNum = Number(dayId);

    const existingDays = program[movKey]?.completedDays || [];
    const existingIndex = existingDays.findIndex((d) => d.dayId === dayNum);

    if (existingIndex >= 0) {
      // Mark as uncompleted
      existingDays.splice(existingIndex, 1);
    } else {
      // Mark as completed
      existingDays.push({
        dayId: dayNum,
        completedDate: formatDate(new Date()),
        completedAt: new Date(),
      });
    }

    program[movKey].completedDays = existingDays;
    await program.save();
    revalidatePath('/programs/smolovjr');

    return {
      success: true,
      data: JSON.parse(JSON.stringify(program)),
    };
  } catch (error) {
    console.error('Error toggling workout completion:', error);
    return {
      success: false,
      error: error.message || 'Failed to toggle workout completion',
    };
  }
}

export async function resetSmolovProgram({ movement }) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session?.user?.id) {
      throw new CustomError('User is not authenticated', 401);
    }

    const userId = session.user.id;
    let program = await SmolovJr.findOne({ userId });

    if (!program) {
      return { success: true };
    }

    if (movement) {
      const movKey = movement === 'bench-press' ? 'benchPress' : 'backSquat';
      program[movKey].completedDays = [];
    } else {
      program.backSquat.completedDays = [];
      program.benchPress.completedDays = [];
    }

    await program.save();
    revalidatePath('/programs/smolovjr');

    return {
      success: true,
      data: JSON.parse(JSON.stringify(program)),
    };
  } catch (error) {
    console.error('Error resetting Smolov Jr program:', error);
    return {
      success: false,
      error: error.message || 'Failed to reset Smolov Jr program',
    };
  }
}
