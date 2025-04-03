'use server'
import connectDB from '@/lib/database/db';
import { z } from "zod"
import bcrypt from "bcrypt"
import User from '@/models/User';
import { deleteSession, createSession, verifySessionForRequests } from './session';
import Pillar from '@/models/Pillar';
import { cookies } from 'next/headers';
import { decrypt } from './session';
import Movement from '@/models/Movement';
import CustomError from './error';


const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})



// ------------------------------ SIGN UP ------------------------------

async function signupUser(data) {
  await connectDB();
  try {
    // Validate the input data
    const validatedData = userSchema.parse(data)
    // Check if user already exists
    const existingUser = await User.findOne({email: validatedData.email})
    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists",
      }
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds)

    // Create a new user 
    const newUser = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    }

    // Add user to our mock database
    const user = await User.create(newUser)
    if(!user) {
      return {
        success: false,
        error: "Failed to create account",
      }
    }
    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid data provided",
      }
    }

    return {
      success: false,
      error: "Failed to create account",
    }
  }
}




// ------------------------ SIGN IN ----------------------------  

export async function signinUserAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  await connectDB();
  try {
    // Check if user already exists
    const existingUser = await User.findOne({email: email})
    if  (!existingUser) {
      throw new Error("Email or password is incorrect")
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      throw new Error("Email or password is incorrect")
    }
  
    // Create a session for the user
    const sanitizedUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
    await createSession(sanitizedUser) 

    return {
      success: true,
      user: sanitizedUser,
    }

  } catch (error) {
    console.log("Signup error:", error.message)

    return {error: error.message, status: 404};
  }
}



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
    console.log({message: error.message, status: error.status})
    return {error: error.message, status: error.status || 500};
  }
}



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



// ---------------------------- LOGOUT ----------------------------

async function logout () {
  await deleteSession();
  return { message: 'Logged out', status: 200 };
}


export { signupUser, logout, createWorkout, addNewMovement, getAllMovements }