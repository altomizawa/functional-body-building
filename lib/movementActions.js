'use server'
import connectDB from '@/lib/database/db';
import { verifySession, verifySessionForRequests } from './session';
import Movement from '@/models/Movement';
import CustomError from './error';

// ---------------- MOVEMENT ACTIONS ----------------------------

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
// ------------------------ FIND MOVEMENT BY NAME --------------------------

async function findMovementByName(input) {
  try{
    await connectDB();

    const session = await verifySession();
    if (!session) {
      throw new CustomError("No session found", 401)
    }

    if (!input || String(input).trim().length === 0) {
      throw new CustomError("Invalid search input", 400)
    }

    // escape regex metacharacters to avoid unexpected patterns
    const escaped = String(input).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i'); // partial, case-insensitive match

    const movements = await Movement.find({ name: { $regex: regex } });

    if (!movements || movements.length === 0) {
      throw new CustomError("No movement found", 404)
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(movements))
    }

  } catch (err) {
    console.log({error: err.message, status: err.status});
    return {error: err.message, status: err.status || 500};
  }
}

// ------------------------ DELETE MOVEMENT --------------------------

async function deleteMovement(id) {
  try {
    await connectDB();

    const session = await verifySession();
    if (!session) {
      throw new CustomError("No session found", 401)
    }

    const movementToDelete = await Movement.findByIdAndDelete(id);

    if (!movementToDelete) {
      throw new CustomError("No movement found", 404)
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(movementToDelete))
    }

  } catch (err) {
    console.log({error: err.message, status: err.status});
    return {error: err.message, status: err.status || 500};
  }
}
// ------------------------ UPDATE MOVEMENT --------------------------

async function updateMovement(id, data) {
  try {
    await connectDB();

    const session = await verifySession();
    if (!session) {
      throw new CustomError("No session found", 401)
    }

    const updatedMovement = await Movement.findByIdAndUpdate(id, data, { new: true });

    if (!updatedMovement) {
      throw new CustomError("No movement found", 404)
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedMovement))
    }

  } catch (err) {
    console.log({error: err.message, status: err.status});
    return {error: err.message, status: err.status || 500};
  }
}



export { addNewMovement, getAllMovements, findMovementByName, deleteMovement, updateMovement }