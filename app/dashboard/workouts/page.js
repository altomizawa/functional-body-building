"use client"

import { useState } from "react"
import movements from '@/lib/movements'
import Preview from '@/components/Preview'
import Link from 'next/link'



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
        <h1 className="text-4xl font-bold text-left">ADD NEW WORKOUT</h1>

        <div className='flex items-center gap-2'>
          {/* <label htmlFor="program">Program: </label> */}
          
          <input className='w-full' onChange={handleWorkoutChange} type="text" name="program" placeholder="Program" value={newWorkout.program} required />
          {/* <label htmlFor="week">Week:</label> */}
          <input className='w-16' onChange={handleWorkoutChange} type="number" name="week" placeholder="Week" value={newWorkout.week} min={1} required />
          {/* <label htmlFor="day">Day:</label> */}
          <input className='w-16' onChange={handleWorkoutChange} type="number" name="day" placeholder="Day" value={newWorkout.day} max={7} min={1} required />
        </div>

        <div id='sections' className='py-4 border-y-[1px] border-black my-4'>
          {/* SECTION */}
          <div className='space-y-8'>
            <div className='w-full space-y-2'>
              <label htmlFor="section">SECTION NAME:</label>
              <input className='w-full' onChange={handleSectionChange} type="text" name="section" placeholder="Section" value={section.section} />
            </div>
            <div className='w-full space-y-2'>
              <label htmlFor="description">DESCRIPTION:</label>
              <textarea className='w-full min-h-48 p-2' onChange={handleSectionChange} type="text" name="description" placeholder="Description" value={section.description} />
            </div>
            <div className='w-full space-y-2'>
              <label htmlFor="notes">NOTES:</label>
              <textarea className='w-full min-h-24 p-2' onChange={handleSectionChange} type="text" name="notes" placeholder="Notes" value={section.notes} />
            </div>
          </div>
          <button type='button' className='button__main-menu my-2 uppercase' onClick={addNewSection}>add section</button>
        </div>
        <Link href="/" className='button__back'>BACK</Link>
        <button className='button__submit'>SUBMIT</button>
      </form>
      <div>
      <h1 className="text-4xl font-bold text-left mt-12 w-[90%] mx-auto">PREVIEW WORKOUT</h1>
      <div className='h-max overflow-auto border-[1px] border-gray-600 mx-auto rounded-lg w-[90%] mt-4'>
        <Preview workout={newWorkout} />
      </div>
      </div>
    </div>
  )
}

