"use client"

import { useState } from "react"
import movements from '@/lib/movements'
import Preview from '@/components/Preview'



export default function PillarWorkoutForm() {
  const [newWorkout, setNewWorkout] = useState({
    program: '',
    week: '',
    day: '',
    sections: []
  })
  const [section, setSection] = useState({
    section: '',
    icon: '',
    description: '',
    notes: ''
  })

  const orderedMovements = movements.sort((a, b) => a.name.localeCompare(b.name))

  // RESET ALL FORMS
  const resetForm = () => {
    setNewWorkout({
      program: '',
      week: '',
      day: '',
      sections: []
    })

    setSection({
      section: '',
      icon: '',
      description: '',
      notes: ''
    })
  }
  


  const onSubmit = (e) => {
    e.preventDefault()
    console.log(newWorkout)
    fetch('/api/programs/pillars/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newWorkout)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err =>console.error(err))
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
    <div className='flex flex-col md:grid md:grid-cols-2 gap-4 h-full'>
      <form onSubmit={onSubmit} className='flex flex-col gap-4 m-12'>
        {/* FORM */}
        <div className='flex items-center gap-4'>
            <label htmlFor="program">Program: </label>
            <input onChange={handleWorkoutChange} type="text" name="program" placeholder="Program" value={newWorkout.program} required />
          <div>

        </div>
        </div>
        <div className='flex items-center gap-2'>
          <label htmlFor="week">Week:</label>
          <input onChange={handleWorkoutChange} type="number" name="week" placeholder="Week" value={newWorkout.week} required />
          <label htmlFor="day">Day:</label>
          <input onChange={handleWorkoutChange} type="number" name="day" placeholder="Day" value={newWorkout.day} required />
        </div>

        <div id='sections' className='bg-gray-200 px-4 py-4 border-[1px] rounded-lg border-black'>
          {/* SECTION */}
          <div className='space-y-4'>
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
              <textarea className='w-full min-h-24 p-2' onChange={handleSectionChange} type="text" name="notes" placeholder="Notes" value={section.notes} />
            </div>
          </div>
          <button type='button' className='w-full bg-black text-white uppercase py-2 rounded-lg my-2' onClick={addNewSection}>add section</button>
        </div>
        <button className='border-2 p-4 bg-green-600 rounded-lg font-bold text-white'>SUBMIT</button>
      </form>
      <div>
        <h2>PREVIEW WORKOUT</h2>
        <div className='h-screen overflow-auto'>
          <Preview workout={newWorkout} />
        </div>
      </div>
    </div>
  )
}

