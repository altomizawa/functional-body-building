"use client"

import { useState } from "react"
import movements from '@/lib/movements'
import Preview from '@/components/Preview'
import { set } from 'mongoose'



export default function WorkoutForm() {
  const [newWorkout, setNewWorkout] = useState({
    date: '',
    program: '',
    week: '',
    day: '',
    sections: []
  })
  const [section, setSection] = useState({
    section: '',
    icon: '',
    description: '',
    videoDemo: [],
    notes: ''
  })

  const [sections, setSections] = useState([])

  const [exercises, setExercises] = useState([])


  const orderedMovements = movements.sort((a, b) => a.name.localeCompare(b.name))

  // RESET ALL FORMS
  const resetForm = () => {
    setNewWorkout({
      date: '',
      program: '',
      week: '',
      day: '',
      sections: []
    })

    setSection({
      section: '',
      icon: '',
      description: '',
      videoDemo: [],
      notes: ''
    })
  }
  


  const onSubmit = (e) => {
    e.preventDefault()
    console.log(newWorkout)
    // fetch('/api/programs/workouts/add', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(newWorkout)
    // })
    // .then(res => res.json())
    // .then(data => console.log(data))
    // .catch(err =>setAlert(err.error))
    // .finally(() => {
    //   console.log(newWorkout)
    //   resetForm()
    // })
    resetForm()
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

    setNewWorkout(prev => ({
      ...prev,
      sections: [...prev.sections, section]
    }))
    setSection({
      section: '',
      icon: '',
      description: '',
      videoDemo: [],
      notes: ''
    })
  }





  return (
    <div className='grid grid-cols-2 gap-4'>
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
          {/* SECTION */}
          <div className='mt-8 space-y-4'>
            <div className='w-full space-y-4'>
              <label htmlFor="section">SECTION NAME:</label>
              <input className='w-full' onChange={handleSectionChange} type="text" name="section" placeholder="Section" value={section.section} />
            </div>
            <div className='w-full space-y-4'>
              <label htmlFor="description">DESCRIPTION:</label>
              <textarea className='w-full min-h-48 p-2' onChange={handleSectionChange} type="text" name="description" placeholder="Description" value={section.description} />
            </div>
            <div className='w-full space-y-4'>
              <label htmlFor="notes">NOTES:</label>
              <textarea className='w-full min-h-48 p-2' onChange={handleSectionChange} type="text" name="notes" placeholder="Notes" value={section.notes} />
            </div>
          </div>
          <button type='button' className='w-full bg-black text-white uppercase py-2' onClick={addNewSection}>add section</button>
        </div>
        <button className='border-2 p-4 bg-green-400'>submit</button>
      </form>
      <div>
        <h2>PREVIEW</h2>
        <Preview workout={newWorkout} />
      </div>
    </div>
  )
}

