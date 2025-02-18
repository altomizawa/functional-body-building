"use client"

import { useState } from "react"
import movements from '@/lib/movements'
import { set } from 'mongoose'
import Preview from '@/components/Preview'
import { cleanDate } from '@/app/utils/utils'
import EditTrainingSection from '@/components/EditTrainingSection'



export default function WorkoutForm() {
  const [newWorkout, setNewWorkout] = useState({
    date: '',
    program: '',
    week: '',
    day: '',
    workout: []
  })
  const [section, setSection] = useState({
    section: '',
    icon: '',
    exercises: [],
    notes: ''
  })
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    video: ''
  })

  const [sections, setSections] = useState([])

  const [exercises, setExercises] = useState([])

  const orderedMovements = movements.sort((a, b) => a.name.localeCompare(b.name))


  const onSubmit = (e) => {
    e.preventDefault()
    console.log('sent')
    // newWorkout.workout = sections

    // fetch('/api/programs/pillars/workouts', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(newWorkout)
    // })
    // .then(res => res.json())
    // .then(data => console.log(data))
    // .catch(err => console.log(err))
    // .finally(() => {
    //   console.log(newWorkout)
    //   resetForm()
    // })
  }

  const handleWorkoutChange = async (e) => {
    console.log(e.target.value)
    const res = await fetch(`http://localhost:3000/api/programs/pillars/workouts/${e.target.value}`)
    const workout = await res.json()
    console.log(workout)
    setNewWorkout(
      {
        date: cleanDate(workout.date),
        program: workout.program,
        week: workout.week,
        day: workout.day,
        workout: workout.workout
      }
    )
  }


  return (
    <>
      <form onSubmit={onSubmit} className='flex flex-col gap-4 m-12'>

        {/* FORM */}
        <div>
          <label htmlFor="date">Date</label>
          <input onChange={handleWorkoutChange} type='date' name='date' value={newWorkout.date} required />
        </div>
        <div>
          <h1>{newWorkout.date}</h1>
          <p>{newWorkout.program}</p>
        </div>
        {/* WORKOUT */}
        {
          newWorkout !== null ? 
          (<>
            <div className="mt-4 mb-12">
              <EditTrainingSection dailyWorkout={newWorkout.workout} />
            </div>
          </>) : (
            <div className='flex justify-center items-center h-[80vh]'>
                <h1 className="font-bold text-2xl text-black uppercase">No workout found</h1>
            </div>
          )
        }
        
        <button type='button'>add section</button>
        <button className='border-2 p-4 bg-green-400'>submit</button>
      </form>

    </>

    
  )
}

