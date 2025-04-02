"use client"

import { useState } from "react"
import Preview from '@/components/Preview'
import Link from 'next/link'
import  { createWorkout } from '@/lib/actions'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'



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

   const toast = useToast().toast

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
  


  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await createWorkout(newWorkout)
    if (!response.success) {
      toast({
        title: 'Error',
        description: response.error,
      })
      return
    }
    toast({
      title: 'Success',
      description: 'Workout added successfully',
    })
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
      <form onSubmit={onSubmit} className='flex flex-col md:grid md:grid-cols-2 gap-12 h-full px-6 my-16 max-w-[1440px] mx-auto'>
        {/* FORM */}
        <div>
          <Toaster />
          <h1 className="text-2xl md:text-3xl font-bold text-left">ADD NEW WORKOUT</h1>
          <div className='flex items-center gap-2 mt-4'>
            {/* <label htmlFor="program">Program: </label> */}
            
            <input className='w-full' onChange={handleWorkoutChange} type="text" name="program" placeholder="Program" value={newWorkout.program} required />
            {/* <label htmlFor="week">Week:</label> */}
            <input className='w-16' onChange={handleWorkoutChange} type="number" name="week" placeholder="Week" value={newWorkout.week} min={1} required />
            {/* <label htmlFor="day">Day:</label> */}
            <input className='w-16' onChange={handleWorkoutChange} type="number" name="day" placeholder="Day" value={newWorkout.day} max={7} min={1} required />
          </div>

          <div id='sections' className='py-4  my-4'>
            {/* SECTION */}
            <div className='space-y-8'>
              <div className='w-full space-y-2'>
                <label htmlFor="section">SECTION NAME:</label>
                <input className='w-full' onChange={handleSectionChange} type="text" name="section" placeholder="Section" value={section.section} />
              </div>
              <div className='w-full space-y-2'>
                <label htmlFor="description">DESCRIPTION:</label>
                <textarea className='w-full min-h-48 p-2 border-2' onChange={handleSectionChange} type="text" name="description" placeholder="Description" value={section.description} />
              </div>
              <div className='w-full space-y-2'>
                <label htmlFor="notes">NOTES:</label>
                <textarea className='w-full min-h-24 p-2 border-2' onChange={handleSectionChange} type="text" name="notes" placeholder="Notes" value={section.notes} />
              </div>
            </div>
            <button type='button' className='button__main-menu my-2 uppercase' onClick={addNewSection}>add section</button>
          </div>

        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-left mx-auto">PREVIEW WORKOUT</h1>
          <div className='h-max overflow-auto border-[1px] border-gray-600 rounded-lg mt-4'>
            <Preview workout={newWorkout} />
          </div>
          <div className='flex flex-col gap-4 mt-4'>
            <Link href="/" className='button__back'>BACK</Link>
            <button className='button__submit'>SUBMIT</button>
          </div>
        </div>
      </form>
  )
}

