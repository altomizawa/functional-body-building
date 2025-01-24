"use client"

import { useState } from "react"
import movements from '@/lib/movements'
import { set } from 'mongoose'


export default function WorkoutForm() {
  const [newWorkout, setNewWorkout] = useState({
    date: '',
    program: '',
    week: 0,
    day: 0,
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

  const onSubmit = (e) => {
    e.preventDefault()
    newWorkout.workout = sections
    console.log(newWorkout)
  }

  const handleWorkoutChange = (e) => {
    setNewWorkout( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSectionChange = (e) => {
    setSection(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const addNewSection = () => {
    sections.push(section)
    setSection({
      section: '',
      icon: '',
      exercises: [],
      notes: ''
    })
  }

  const addNewExercise = () => {
    exercises.push(exercise)
    setExercise({
      name: '',
      description: '',
      video: ''
    })
    section.exercises.push(exercise)
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4 m-12'>
      <div>
        <label htmlFor="date">Date</label>
        <input onChange={handleWorkoutChange} type='date' name='date' value={newWorkout.date} />
      </div>
      <div>
        <label htmlFor="program">Program</label>
        <input onChange={handleWorkoutChange} type="text" name="program" placeholder="Program" />
      </div>
      <div className='flex items-center gap-2'>
        <label htmlFor="week">Week</label>
        <input onChange={handleWorkoutChange} type="number" name="week" placeholder="Week" />
        <label htmlFor="day">Day</label>
        <input onChange={handleWorkoutChange} type="number" name="day" placeholder="Day" />
      </div>

      <div id='sections' className='bg-gray-200 p-4'>
        {
          sections.map((section, index) => (
            <div key={index} className='flex flex-col gap-2 border-b-2 py-4 border-gray-800'>
              {/* <h3>Section:</h3> */}
              <h3 className='uppercase'>{section.section}</h3>
              {/* <h3>exercises:</h3> */}
              {
                exercises.map((exercise, index) => (
                  <div key={index} className='flex flex-col gap-2'>
                    <p>{exercise.name}</p>
                    <p>{exercise.description}</p>
                    <p>{exercise.video}</p>
                  </div>
                ))
              }
              {/* <h3>notes:</h3> */}
              <p>{section.notes}</p>
            </div >
          ))
        }
        <div className='mt-8 space-y-4'>
          <div className='w-full'>
            {/* <label htmlFor="section">Section</label> */}
            <input className='w-full' onChange={handleSectionChange} type="text" name="section" placeholder="Section" value={section.section} />
          </div>
          <div>
            {/* <label htmlFor="icon">Icon</label> */}
            <input className='w-full' onChange={handleSectionChange} type="text" name="icon" placeholder="Icon" />
          </div>
          <div className='flex gap-2 w-full flex-col border-[1px] border-gray-400 rounded-md p-4'>
            <label htmlFor="name">EXERCISE</label>
            <input className='w-full' onChange={handleSectionChange} type="text" name="name" placeholder="Name" />
            <input className='w-full' onChange={handleSectionChange} type="text" name="description" placeholder="Description" />
            <input className='w-full' onChange={handleSectionChange} type="text" name="Video Link" placeholder="video Link" />
            <button onClick={addNewExercise} className='border-[1px] border-gray-600 py-2 rounded-md hover:bg-black hover:text-white duration-500' type='button'>+ exercise</button>
          </div>
          <div>
            {/* <label htmlFor="notes">Notes</label> */}
            <input className='w-full' onChange={handleSectionChange} type="text" name="notes" placeholder="Notes" value={section.notes} />
          </div>
        </div>
      </div>
      <button type='button' onClick={addNewSection}>add section</button>
      <button className='border-2 p-4 bg-green-400'>submit</button>
    </form>
  )
}

