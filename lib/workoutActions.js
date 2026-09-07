'use server'
import connectDB from '@/lib/database/db';
import User from '@/models/User';
import { verifySessionForRequests } from './session';
import Pillar from '@/models/Pillar';
import Pump4x from '@/models/Pump4x';
import CustomError from './error';

// ----------- WORKOUT ACTIONS ----------------------------

// ----------------------------CREATE NEW WORKOUT -----------------------------

async function createWorkout(newWorkout) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }

    const { user } = session;

    // if user is not admin, throw error
    if (user.role !== "admin") {
      throw new CustomError("You do not have permission to create workouts", 403)
    }

    // if session is valid and user has authorization, check if workout exists
    const existingWorkout = await Pillar.findOne({
      program: newWorkout.program.toLowerCase().trim(),
      week: newWorkout.week,
      day: newWorkout.day
    });

    // if workout exists, return error
    if (existingWorkout) {
      throw new CustomError("There's already a workout", 409)
    }

    const addedWorkout = await Pillar.create(
      {
        program: newWorkout.program.toLowerCase().trim(),
        week: newWorkout.week,
        day: newWorkout.day,
        sections: newWorkout.sections,
      }
    );

    // if workout isn't created, return error
    if (!addedWorkout) {
      throw new CustomError("Failed to create workout", 500)
    }
    return {
      success: true,
      workout: JSON.parse(JSON.stringify(addedWorkout))
    }

  } catch (error) {
    console.log({ message: error.message, status: error.status })
    return { error: error.message, status: error.status || 500 };
  }
}

// UPDATE WORKOUT
async function updateWorkout(newWorkout) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }

    const { user } = session;

    // if user is not admin, throw error
    if (user.role !== "admin") {
      throw new CustomError("You do not have permission to create workouts", 403)
    }

    // if session is valid and user has authorization, check if workout exists
    const existingWorkout = await Pillar.findOne({
      program: newWorkout.program.trim(),
      week: newWorkout.week,
      day: newWorkout.day
    });

    // if workout exists, return error
    if (!existingWorkout) {
      throw new CustomError("No Workout Found", 409)
    }

    // if workout exists, update workout
    existingWorkout.sections = newWorkout.sections;
    await existingWorkout.save();

    return {
      success: true,
      workout: JSON.parse(JSON.stringify(existingWorkout))
    }

  } catch (error) {
    console.log({ message: error.message, status: error.status })
    return { error: error.message, status: error.status || 500 };
  }
}

// ---------------------------- GET WORKOUT BY PROGRAM, WEEK, DAY ----------------------------
async function fetchWorkout(program, week, day, collection = 'pillars') {
  try {
    await connectDB();
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }

    const Model = (collection === 'pump4x' || collection === 'Pump4x') ? Pump4x : Pillar;

    // if session is valid and user has authorization, check if workout exists
    let workout = await Model.findOne({
      program: program.trim(),
      week: Number(week),
      day: Number(day)
    }).populate('sections.movements.type');

    if (!workout) {
      workout = await Model.findOne({
        program: { $regex: new RegExp(`^${program.trim()}$`, 'i') },
        week: Number(week),
        day: Number(day)
      }).populate('sections.movements.type');
    }

    if (!workout) {
      workout = await Model.findOne({
        week: Number(week),
        day: Number(day)
      }).populate('sections.movements.type');
    }

    // if workout exists, return error
    if (!workout) {
      throw new CustomError("No workout found", 409)
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(workout))
    }

  } catch (error) {
    console.log({ message: error.message, status: error.status })
    return { success: false, error: error.message, status: error.status || 500 };
  }
}

// ---------------------------- DELETE  WORKOUT ----------------------------
async function deleteWorkout(workoutId) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }

    // if session is valid and user has authorization, check if workout exists
    const workout = await Pillar.findByIdAndDelete(workoutId);

    // if workout exists, return error
    if (!workout) {
      throw new CustomError("No workout found", 409)
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(workout))
    }

  } catch (error) {
    console.log({ message: error.message, status: error.status })
    return { error: error.message, status: error.status || 500 };
  }
}


// ---------------------------- ADD COMPLETED WORKOUT ----------------------------

// You can pass this into a form or call it manually
async function markWorkoutAsCompleted({ userId, workoutId }) {

  try {
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Check for duplicates
    const alreadyCompleted = user.completed.some(entry =>
      entry.pillarId.toString() === workoutId.toString()
    );

    if (alreadyCompleted) {
      throw new Error('Workout already completed by this user');
    }

    // Add to completed
    user.completed.push({
      pillarId: workoutId,
    });

    await user.save();

    return {
      success: true,
      message: 'Workout marked as completed',
    };
  } catch (error) {
    console.error('❌ Error in markWorkoutAsCompleted:', error);
    return {
      success: false,
      message: error.message || 'Something went wrong'
    };
  }
}

// ---------------------------- REMOVE COMPLETED WORKOUT ----------------------------

// You can pass this into a form or call it manually
async function markWorkoutAsUncompleted({ userId, workoutId }) {

  try {
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Check if workout has been completed
    const alreadyCompleted = user.completed.some(entry =>
      entry.pillarId.toString() === workoutId.toString()
    );

    if (!alreadyCompleted) {
      throw new Error("Workout hasn't been completed by this user");
    }

    // Remove from completed
    // user.completed.filter( workout => workout.pillarId.toString() !== workoutId.toString());
    const newCompletedWorkout = user.completed.filter(workout => workout.pillarId.toString() !== workoutId.toString())
    user.completed = newCompletedWorkout;
    await user.save();

    return {
      success: true,
      message: 'Workout marked as uncompleted',
    };
  } catch (error) {
    console.error('❌ Error in markWorkoutAsCompleted:', error);
    return {
      success: false,
      message: error.message || 'Something went wrong'
    };
  }
}

// ---------------------------- GET COMPLETED WORKOUTS ----------------------------
async function getLatestCompletedWorkout(userId) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session) throw new CustomError("User is not authenticated", 401);

    const user = await User.findById(userId).populate('completed.pillarId');

    if (!user) throw new Error("User not found");

    const latest = user.completed
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

    if (!latest || !latest.pillarId) {
      return { success: true, data: null };
    }

    let { program, week, day } = latest.pillarId;
    if (day === 7) {
      day = 1;;
      week += 1;
    }

    return {
      success: true,
      data: { program, week, day }
    };
  } catch (error) {
    console.error("❌ Error in getLatestCompletedWorkout:", error);
    return {
      success: false,
      message: error.message || "Something went wrong"
    };
  }
}

// ---------------------------- GET WORKOUT BY ID ----------------------------
async function getWorkoutById(workoutId) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session) throw new CustomError("User is not authenticated", 401);

    const latestWorkout = await Pillar.findById(workoutId)

    if (!latestWorkout) throw new CustomError("No workout found", 404);

    return {
      success: true,
      data: { latestWorkout }
    };
  } catch (error) {
    console.error("Error getting latest workout", error);
    return {
      success: false,
      message: error.message || "Something went wrong"
    };
  }
}

// FETCH PUMP WORKOUT
async function getPumpWorkout({ date, fallbackToLatest = false } = {}) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session) throw new CustomError("User is not authenticated", 401);

    let workout = null;
    let targetDate = null;

    if (date) {
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-').map(Number);
        targetDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      } else {
        targetDate = new Date(date);
      }
    } else if (!fallbackToLatest) {
      targetDate = new Date();
    }

    if (targetDate && !isNaN(targetDate.getTime())) {
      const startOfDay = new Date(targetDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      workout = await Pump4x.findOne({
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate('sections.movements.type');

      if (!workout) {
        const localStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
        const localEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
        workout = await Pump4x.findOne({
          date: { $gte: localStart, $lte: localEnd }
        }).populate('sections.movements.type');
      }
    }

    if (!workout && fallbackToLatest) {
      workout = await Pump4x.findOne()
        .sort({ date: -1 })
        .populate('sections.movements.type');
    }

    if (!workout) {
      return {
        success: false,
        error: "No workout found for this date",
        data: null
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(workout))
    };
  } catch (error) {
    console.error("Error fetching pump workout:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch pump workout",
      status: error.status || 500,
      data: null
    };
  }
}


export { createWorkout, updateWorkout, deleteWorkout, fetchWorkout, markWorkoutAsCompleted, markWorkoutAsUncompleted, getLatestCompletedWorkout, getWorkoutById, getPumpWorkout }