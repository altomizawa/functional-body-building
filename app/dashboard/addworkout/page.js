"use client"

import { useState } from "react"
import movements from '@/lib/movements'
import Preview from '@/components/Preview'



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

  // RESET ALL FORMS
  const resetForm = () => {
    setNewWorkout({
      date: '',
      program: '',
      week: 0,
      day: 0,
      workout: []
    })

    setSection({
      section: '',
      icon: '',
      exercises: [],
      notes: ''
    })

    setExercise({
      name: '',
      description: '',
      video: ''
    })
  }
  
  const [alert, setAlert] = useState('')


  const onSubmit = (e) => {
    e.preventDefault()
    
    newWorkout.workout = sections
    
    fetch('/api/programs/pillars/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newWorkout)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err =>setAlert(err.error))
    .finally(() => {
      console.log(newWorkout)
      resetForm()
    })
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
  
  const handleExerciseChange = (e) => {
    setExercise(prev => ({
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
    section.exercises.push
    // setSection(prev => ({
    //   ...prev,
    //   exercises: exercises
    // }))
    // section.exercises.push(exercise)
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4 m-12'>
      {/* FORM */}
      <div>
        <label htmlFor="date">Date</label>
        <input onChange={handleWorkoutChange} type='date' name='date' value={newWorkout.date} required />
      </div>
      <div>
        <label htmlFor="program">Program</label>
        <input onChange={handleWorkoutChange} type="text" name="program" placeholder="Program" value={newWorkout.program} required />
      </div>
      <div className='flex items-center gap-2'>
        <label htmlFor="week">Week</label>
        <input onChange={handleWorkoutChange} type="number" name="week" placeholder="Week" value={newWorkout.week} required />
        <label htmlFor="day">Day</label>
        <input onChange={handleWorkoutChange} type="number" name="day" placeholder="Day" value={newWorkout.day} required />
      </div>


      {/* PREVIEW */}
      <div id='sections' className='bg-gray-200 p-4'>
        <Preview sections={sections} exercises={exercises} />

        {/* SECTION */}
        <div className='mt-8 space-y-4'>
          <div className='w-full'>
            {/* <label htmlFor="section">Section</label> */}
            <input className='w-full' onChange={handleSectionChange} type="text" name="section" placeholder="Section" value={section.section} />
          </div>
          <div>
            {/* <label htmlFor="icon">Icon</label> */}
            {/* <input className='w-full' onChange={handleSectionChange} type="text" name="icon" placeholder="Icon" value={section.icon} /> */}
          </div>


          {/* EXERCISE */}
          <div className='flex gap-2 w-full flex-col border-[1px] border-gray-400 rounded-md p-4'>
            <label htmlFor="name">EXERCISE</label>
            <input className='w-full' onChange={handleExerciseChange} type="text" name="name" placeholder="Name" value={exercise.name}/>
            <input className='w-full' onChange={handleExerciseChange} type="text" name="description" placeholder="Description" value={exercise.description} />
            <select className='border-2 py-2 px-2 text-sm' name="video" onChange={handleExerciseChange}>
              {orderedMovements.map((movement, index) => (
                <option key={index} value={movement.link} >{movement.name}</option>)
              )}
            </select>
            {/* <input className='w-full' onChange={handleExerciseChange} type="text" name="video" placeholder="video Link" value={exercise.video} /> */}
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
      {/* ALERT MESSAGE */}
      {/* {alert && <div>{alert}</div>} */}
    </form>
  )
}

