'use server'
import connectDB from '@/lib/database/db';
import User from '@/models/User';
import { deleteSession, verifySessionForRequests } from './session';
import Pillar from '@/models/Pillar';
import Movement from '@/models/Movement';
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
    console.log("Workout created successfully:", addedWorkout);
    return {
      success: true,
      workout: JSON.parse(JSON.stringify(addedWorkout))
    }
    
  } catch (error) {
    console.log({message: error.message, status: error.status})
    return {error: error.message, status: error.status || 500};
  }
}

// ---------------------------- GET WORKOUT BY PROGRAM, WEEK, DAY ----------------------------
async function fetchWorkout(program, week, day ) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }

    // if session is valid and user has authorization, check if workout exists
    const workout = await Pillar.findOne({
      program: program.trim(),
      week: week,
      day: day
    });

    // if workout exists, return error
    if (!workout) {
      throw new CustomError("No workout found", 409)
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(workout))
    }
    
  } catch (error) {
    console.log({message: error.message, status: error.status})
    return {error: error.message, status: error.status || 500};
  }
}


// ---------------------------- ADD COMPLETED WORKOUT ----------------------------

// You can pass this into a form or call it manually
async function markWorkoutAsCompleted({userId, workoutId}) {
 
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
async function markWorkoutAsUncompleted({userId, workoutId}) {
 
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
    console.log(user.completed.filter( workout => workout.pillarId.toString() === workoutId.toString()))
    // user.completed.filter( workout => workout.pillarId.toString() !== workoutId.toString());
    const newCompletedWorkout = user.completed.filter( workout => workout.pillarId.toString() !== workoutId.toString())
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


// ---------------- MOVEMENTT ACTIONS ----------------------------

// --------------------------- ADD NEW MOVEMENT -----------------------

async function addNewMovement (newMovement) {
  try{
    await connectDB();
    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("No session found", 401)
    }

    const { user } = session;

    // if user is not admin, throw error
    if (user.role !== "admin") {
      throw new CustomError("You do not have permission to add a movement", 403)
    } 

    // if session is valid and user has authorization, check if movement exists
    const existingMovement = await Movement.findOne({name: newMovement.name.toLowerCase().trim()});
    
    //  if movement exists, return error
    if (existingMovement) {
      throw new CustomError("Movement already exists", 409)
    }

    // if movement does not exist, create movement
    const addedMovement = await Movement.create({name: newMovement.name.toLowerCase().trim(), link: newMovement.link.trim()});

    // if movement is not created, throw error
    if (!addedMovement) {
      throw new CustomError("Failed to create movement", 500)
    } 

    // if movement is created, create sanitized movement
    const sanitizedMovement = {
      id: addedMovement.id,
      name: addedMovement.name,
      link: addedMovement.link,
    }
    return {
      success: true, 
      data: sanitizedMovement
    }
  } catch(err) {
    return {error: err.message, status: err.status || 500};
  }
}


// ------------------------ GET ALL MOVEMENTS --------------------------

async function getAllMovements() {
  try{
    // connect to DB
    await connectDB();

    const session = await verifySessionForRequests();

    // if no session, throw error
    if (!session) {
      throw new CustomError("No session found", 401)
    }

     // get all movements
    const movements = await Movement.find();

    // if there are no movements, return error
    if (!movements || movements.length === 0) {
      throw new CustomError("No movement found", 404)
    }
    
    // if there are movements, return movements
    return {
      success: true,
      data: JSON.parse(JSON.stringify(movements))
    }

  } catch (err) {
    console.log({error: err.message, status: err.status});
    return {error: err.message, status: err.status || 500};
  }
}

// ---------------------- USER ACTIONS ----------------------------

// ---------------------------- GET USER DATA BY ID----------------------------
async function getUserById(userId) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    if (!session) throw new CustomError("User is not authenticated", 401);
    if (!userId) throw new CustomError("User ID is required", 400);
    const user = await User.findById(userId).populate('completed.pillarId');
    if (!user) throw new CustomError("User not found", 404);
    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error("Error getting user data", error);
  }
}
// ---------------------------- GET ALL USERS ----------------------------

async function getAllUsers() {
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
      throw new CustomError("You do not have permission to fetch users", 403)
    }
    
    // Check if there are users in the database
    const users = await User.find()
    if  (!users || users.length === 0) {
      throw new CustomError("No users found", 404)
    }
    
    return {
      success: true,
      status: 200,
      data: JSON.parse(JSON.stringify(users))
    }
  } catch (error) {
    console.log("Error fetching users:", error.message)
    
    return {error: error.message, status: error.status || 500};
  }
}

// ---------------------------- MODIFY USER ----------------------------

async function modifyUser(userData) {
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
      throw new CustomError("You do not have permission to modify users", 403)
    }
    
    // Check if the user exists
    const existingUser = await User.findById(userData.id);
    if (!existingUser) {
      throw new CustomError("User not found", 404)
    }
    
    // Update user fields if they are provided
    if (userData.name) existingUser.name = userData.name.toLowerCase().trim();
    if (userData.email) existingUser.email = userData.email.toLowerCase().trim();
    if (userData.phone) existingUser.phone = userData.phone;
    if (userData.status) existingUser.status = userData.status;
    
    // Save the updated user
    const updatedUser = await existingUser.save();
    
    if (!updatedUser) {
      throw new CustomError("Failed to update user", 500)
    }
    
    // Return sanitized user data
    const sanitizedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      status: updatedUser.status,
      role: updatedUser.role
    };
    
    return {
      success: true,
      status: 200,
      data: sanitizedUser
    }
  } catch (error) {
    console.log("Error modifying user:", error.message)
    return {error: error.message, status: error.status || 500};
  }
}

async function getSessionFromClient() {
  try{
    const session = await verifySessionForRequests()
    if (!session) {
      throw new Error("Session not found")
    } else {
      const user = await User.findById(session.user.id)
      if (!user) {
        throw new Error("User not found")
      }
      const sanitizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        completedWorkouts: user.completed,
      }
      return sanitizedUser
    }
  } catch (error) {
    console.log(error)
    return null
  }
}


export { 
  createWorkout, 
  fetchWorkout,
  markWorkoutAsCompleted,
  markWorkoutAsUncompleted,
  getLatestCompletedWorkout,
  getWorkoutById,
  getAllMovements, 
  addNewMovement, 
  modifyUser, 
  getAllUsers,
  getUserById,
  getSessionFromClient
}