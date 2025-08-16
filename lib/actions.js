'use server'
import connectDB from '@/lib/database/db';
import User from '@/models/User';
import { verifySessionForRequests } from './session';
import CustomError from './error';
import { revalidatePath } from 'next/cache';

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

// ---------------------------- UPDATE USER PROFILE ----------------------------
export async function updateProfile(userId,userData) {
  try {
    await connectDB();
    const session = await verifySessionForRequests();
    
    // if no session, throw error
    if (!session) {
      throw new CustomError("User is not authenticated", 401)
    }
    
    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new CustomError("User not found", 404)
    }
    
    // Update user fields if they are provided
    if (userData.name) existingUser.name = userData.name.toLowerCase().trim();
    if (userData.email) existingUser.email = userData.email.toLowerCase().trim();
    
    // Save the updated user
    const updatedUser = await existingUser.save();
    
    if (!updatedUser) {
      throw new CustomError("Failed to update user", 500)
    }
    
    // Return sanitized user data
    const sanitizedUser = {
      name: updatedUser.name,
      email: updatedUser.email,
    };

    revalidatePath(`/`);

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
  modifyUser, 
  getAllUsers,
  getUserById,
  getSessionFromClient
}