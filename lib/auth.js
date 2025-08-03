'use server'
import connectDB from '@/lib/database/db';
import { z } from "zod"
import bcrypt from "bcrypt"
import User from '@/models/User';
import { deleteSession, createSession, verifySessionForRequests } from './session';
import { sendResetEmail } from '@/utils/mailer';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})



// ------------------------------ SIGN UP ------------------------------

export async function signupUser(data) {
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
    const existingUser = await User.findOne({email: email}).select('+password');
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

// ---------------------- CHECK IF USER EXISTS ---------------------
export async function isUserinDB(email) {
  await connectDB();
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    return {
      success: true
    }
  } catch (error) {
    console.error("User was not found:", error);
    return {success: false, error: error.message, status: 404};
  }
}

// ---------------------------- LOGOUT ----------------------------

export async function logout () {
  await deleteSession();
  return { message: 'Logged out', status: 200 };
}

// ------------------------ SEND 2FA CODE ------------------------
export async function send2FACode(email) {
  await connectDB();
  
  const code = Math.floor(1000 + Math.random() * 9000);
  const expiresIn = 5 * 50 * 1000; // 5 minutes
  const saltRounds = 10;
  const hashedCode = await bcrypt.hash(code.toString(), saltRounds);

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    user.TwoFAToken = hashedCode;
    user.TwoFATokenExpires = Date.now() + expiresIn;
    await user.save();
    
    await sendResetEmail(email, null, '2fa', code);
    return { success: true, status: 200 };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message, status: 500 };
  }
}

// ------------------------ CHECK 2FA CODE ------------------------
export async function check2FACode(email, code) {
  await connectDB();
  try{
    const user = await User.findOne({ email: email, TwoFATokenExpires: { $gt: Date.now() } });
    if (!user) {
      throw new Error("User not found");
    }
    const { TwoFAToken } = user;
    const isValid = await bcrypt.compare(code.toString(), TwoFAToken);

    if (!isValid) {
      throw new Error("Invalid code");
    }
    // Create a session for the user
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    await createSession(sanitizedUser)
  
    // Clear the 2FA token after validation
    user.TwoFAToken = null;
    user.TwoFATokenExpires = null;
    await user.save();
    
    return { success: true };

  } catch (error) {
    console.error("Error checking 2FA code:", error);
    return { success: false, error: error.message, status: 404 };
  }
}