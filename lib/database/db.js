'use server'
const MONGODB_URI = process.env.MONGODB_URI
import mongoose from 'mongoose'

export default async function connectDB() {
  let connected = false
  if (!connected){
    try{
      const connection = await mongoose.connect(MONGODB_URI, {
        dbName: "functional_bodybuilding",
      })
      if(!connection) {
        return new Error({status: 500, message: 'error connection to server'})
      }
      return console.log('database connected')
    }catch (err) {console.log(err)}
  }
  return console.log('database already connected!')

  }