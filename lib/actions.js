'use server'
import connectDB from '@/lib/database/db';
import { z } from "zod"
import bcrypt from "bcrypt"
import User from '@/models/User';
import { deleteSession } from './session';
import { createSession } from './session';
import Pillar from '@/models/Pillar';


const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

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

async function createWorkout(newWorkout) {
  try {
    await connectDB();
    const existingWorkout = await Pillar.findOne({ program: newWorkout.program, week: newWorkout.week, day: newWorkout.day });
    if (existingWorkout) {
      // if workout exists, return error
      throw new Error("There's already a current workout on this date")
    } else {
      const addedWorkout = await Pillar.create(newWorkout);
      return {
        success: true,
        workout: addedWorkout
      }
    }
  } catch (error) {
    console.log("Workout creation error:", error.message)
    return {error: error.message, status: 404},{status: 404};
  }
}


// async function signinUser(_, formData) {
//   console.log('formData', formData)
//   // get Values
//   const email = formData.get('email')
//   const password = formData.get('password')

//   // await connectDB();
//   try {
//     // Check if user already exists
//     // const existingUser = await User.findOne({email: email})
//     const existingUser = await fetch(`/api/auth/signin`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     })
//     if  (!existingUser) {
//       return {
//         success: false,
//         error: "Email or password is incorrect",
//       }
//     }
//     // Check if password is correct
//     // const isPasswordValid = await bcrypt.compare(password, existingUser.password)
//     // if (!isPasswordValid) {
//     //   return {
//     //     success: false,
//     //     error: "Email or password is incorrect",}
//     // }

//     // createSession(existingUser._id) // Create a session for the user
//     // create json web token
//     // const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
//     return {
//       success: true,
//       // token: token,
//     }

//   } catch (error) {
//     console.error("Signup error:", error)

//     return {
//       success: false,
//       error: "Failed to login",
//     }
//   }
// }







// async function getMovements() {
//   await connectDB();
//   const movements = await Movement.find();
//   if (!movements || movements.length === 0) {
//     return { success: false, error: 'No movement found' };
//   }
//   return { success: true, data: movements };
// }


// async function getWorkout({program, week, day}) {
//   try {
//     const response = await Pillar.findOne({ program: program, week: week, day: day }); 
//     if (!response) {
//       return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
//     }
//     return response
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
//   }}


  async function logout () {
    await deleteSession();
    return { message: 'Logged out' }, { status: 200 };
  }
  export { signupUser, logout, createWorkout }