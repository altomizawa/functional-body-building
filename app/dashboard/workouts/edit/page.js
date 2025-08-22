"use client"

import { useState, useEffect, useRef } from "react"
import Preview from '@/components/Preview'
import Link from 'next/link'
import { fetchWorkout, updateWorkout } from '@/lib/workoutActions'
import { getAllMovements } from '@/lib/movementActions'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { PROGRAM_LIST, MAX_DAYS, MAX_WEEKS } from '@/lib/constants'
import { set } from 'mongoose'
import DeletePopup from '@/components/DeletePopup'
import Dropdown from '@/components/form/Dropdown'

export default function EditWorkoutForm() {
  const [movements, setMovements] = useState([])
  const [filteredMovements, setFilteredMovements] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [deletePopup, setDeletePopup] = useState(false)
  const [isThereAWorkout, setIsThereAWorkout] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    program: '',
    week: '',
    day: '',
    sections: [
      {
        section: '',
        icon: '',
        description: '',
        movements: [],
        notes: ''
      },
    ]
  })

  const toast = useToast().toast
  const movementInputRef = useRef(null)

  // RESET ALL FORMS
  const resetForm = () => {
    setNewWorkout({
      program: '',
        week: '',
        day: '',
        sections: [
          {
            section: '',
            icon: '',
            description: '',
            movements: [],
            notes: ''
          },
        ]
    })
    setCurrentSection(0)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await updateWorkout(newWorkout)
      if (!response.success) {
        toast({
          title: 'Error',
          description: response.error,
        })
        return
      }
      toast({
        title: 'Success',
        description: 'Workout updated successfully',
      })
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create workout',
      })
      console.error(error)
    }
    resetForm()
    setIsThereAWorkout(false)
  }

  const handleWorkoutChange = (e) => {
    setNewWorkout(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSectionChange = (e, sectionIndex) => {
    const index = sectionIndex !== undefined ? sectionIndex : currentSection
    
    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.map((section, idx) => {
        if (idx === index) {
          return {
            ...section,
            [e.target.name]: e.target.value
          }
        }
        return section
      })
    }))
  }

  // HANDLE MOVEMENT SEARCH
  const handleMovementSearch = (e, index) => {
    const searchValue = e.target.value
    setSearchText(searchValue)
    
    if (!searchValue) {
      setFilteredMovements(null)
      return
    }
    
    setCurrentSection(index)
    
    setFilteredMovements(
      movements.filter(movement =>
        movement.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    )
  }

  const addMovement = (movement) => {
    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => {
        if (index === currentSection) {
          // Check if movement already exists in this section
          if (!section.movements.some(m => m._id === movement._id)) {
            return {
              ...section,
              movements: [...section.movements, movement]
            };
          }
        }
        return section;
      })
    }));

    setFilteredMovements(null);
    setSearchText('');
    if (movementInputRef.current) {
      movementInputRef.current.value = '';
    }
  };

  const removeMovement = (movement, sectionIndex) => {
    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => {
        if (index === sectionIndex) {
          return {
            ...section,
            movements: section.movements.filter(prevMovement => 
              prevMovement._id !== movement._id
            )
          };
        }
        return section;
      })
    }));
  };

  const addNewSection = () => {
    setNewWorkout(prev => ({
      ...prev,
      sections: [...prev.sections, {
        section: '',
        icon: '',
        description: '',
        movements: [],
        notes: ''
      }]
    }))
    setCurrentSection(newWorkout.sections.length)
  }
  
  const removeSection = (indexToRemove) => {
    if (newWorkout.sections.length <= 1) {
      toast({
        title: 'Error',
        description: 'Cannot remove the only section',
      })
      return
    }
    
    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== indexToRemove)
    }));

    // Adjust current section index if needed
    setCurrentSection(prev => (prev >= indexToRemove ? Math.max(prev - 1, 0) : prev));
  };

  const selectSection = (index) => {
    setCurrentSection(index)
    setFilteredMovements(null)
    setSearchText('')
  }

  const getWorkout = async(formData) => {
    const selectedProgram = formData.get('selectedProgram')
    const selectedWeek = formData.get('selectedWeek')
    const selectedDay = formData.get('selectedDay')
    try {
      const workoutData = await fetchWorkout(selectedProgram, selectedWeek, selectedDay)
      if (!workoutData.success) {
        resetForm()
        toast({
          title: 'Error',
          description: workoutData.error,
        })
        return
      }
      setNewWorkout(workoutData.data)
      setIsThereAWorkout(true)
      toast({
        title: 'Success',
        description: 'Workout fetched successfully',
      })
      // resetForm();
    } catch (error) {
      console.error('Error fetching workout:', error)
      // resetForm()
      toast({
        title: 'Error',
        description: 'Failed to fetch workout',
      })
    }
  }

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const res = await getAllMovements()
        if (!res.success) {
          toast({
            title: 'Error',
            description: res.error,
          })
          return
        }
        setMovements(res.data)
      } catch (error) {
        console.error('Error fetching movements:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch movements',
        })
      }
    }
    fetchMovements()
  }, [])

  return (
    <>
        <Link href="/" className='flex item-center justify-center w-min my-12 ml-8 '>
          <span className="material-symbols-outlined">arrow_back</span>BACK
        </Link>
      <form action={getWorkout} className='h-full px-6 my-16 max-w-[1440px] mx-auto flex gap-4'>
        {/* <input type='text' name='currentProgram' placeholder='Choose a program'/> */}
        <div className='flex items-center gap-2 mt-4'>
          <label htmlFor="selectedProgram">CHOOSE A PROGRAM:</label>
          <select name='selectedProgram' className='p-2'>
            {PROGRAM_LIST.map((program, index) => (
              <option key={index} value={program}>{program}</option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-2 mt-4'>
          <label htmlFor="selectedWeek">WEEK:</label>
          <select name='selectedWeek' className='border-2 p-2 px-4'>
            {Array.from({ length: MAX_WEEKS }, (_, index) => index + 1).map((program, index) => (
              <option key={index} value={program}>{program}</option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-2 mt-4'>
          <label htmlFor="selectedDay">DAY:</label>
          <select name='selectedDay' className='border-2 p-2 px-4'>
            {Array.from({ length: MAX_DAYS }, (_, index) => index + 1).map((program, index) => (
              <option key={index} value={program}>{program}</option>
            ))}
          </select>
        </div>
        <button type='submit' className='px-4 py-2 border bg-black text-white'>Fetch workout</button>
      </form>
      <form onSubmit={onSubmit} className='h-full px-6 my-16 max-w-[1440px] mx-auto'>
        {/* FORM */}
        <div>
          <Toaster />
          <h1 className="text-2xl md:text-3xl font-bold text-left">EDIT WORKOUT</h1>
          <div className='flex items-center gap-2 mt-4'>
            <input
              className='w-full'
              onChange={handleWorkoutChange}
              type="text"
              name="program"
              placeholder="Program"
              value={newWorkout.program}
              required
            />
            <input
              className='w-16'
              onChange={handleWorkoutChange}
              type="number"
              name="week"
              placeholder="Week"
              value={newWorkout.week}
              min={1}
              required
            />
            <input
              className='w-16'
              onChange={handleWorkoutChange}
              type="number"
              name="day"
              placeholder="Day"
              value={newWorkout.day}
              max={7}
              min={1}
              required
            />
          </div>

          {/* Section tabs */}
          <div className="flex flex-wrap gap-2 mt-6 mb-4">
            {newWorkout.sections.map((section, index) => (
              <button
                key={index}
                type="button"
                className={`px-4 py-2 border ${currentSection === index ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => selectSection(index)}
              >
                {section.section || `Section ${index + 1}`}
              </button>
            ))}
            <button
              type="button"
              className="px-4 py-2 border bg-green-500 text-white"
              onClick={addNewSection}
            >
              + Add Section
            </button>
          </div>

          <div id='sections' className='my-4 space-y-8'>
            {/* SECTION */}
            {newWorkout.sections.map((section, index) => (
              <div 
                className={`space-y-8 border-2 p-6 ${currentSection === index ? 'block' : 'hidden'}`} 
                key={index}
              >
                <div className='w-full space-y-2'>
                  <label htmlFor={`section-${index}`}>SECTION NAME:</label>
                  <input
                    className='w-full'
                    onChange={(e) => handleSectionChange(e, index)}
                    type="text"
                    name="section"
                    id={`section-${index}`}
                    placeholder="Section"
                    value={section.section}
                  />
                </div>
                <div className='w-full space-y-2'>
                  <label htmlFor={`description-${index}`}>DESCRIPTION:</label>
                  <textarea
                    className='w-full min-h-48 p-2'
                    onChange={(e) => handleSectionChange(e, index)}
                    type="text"
                    name="description"
                    id={`description-${index}`}
                    placeholder="Description"
                    value={section.description}
                  />
                </div>
                <div className='w-full space-y-2'>
                  <label htmlFor={`movements-${index}`}>ADD MOVEMENTS TO SECTION:</label>
                  <input
                    className='w-full'
                    onChange={(e) => handleMovementSearch(e, index)}
                    type="text"
                    name="movements"
                    id={`movements-${index}`}
                    placeholder="Search movements"
                    value={currentSection === index ? searchText : ''}
                    ref={currentSection === index ? movementInputRef : null}
                  />
                  <div className='flex flex-wrap gap-4'>
                    {section.movements && section.movements.map((movement, movIdx) => (
                      <div key={movIdx} className='border-[1px] border-black/20 px-2 py-1 flex items-center'>
                        <p>{movement.name}</p>
                        <span 
                          className='ml-2 cursor-pointer text-red-500 hover:text-red-700' 
                          onClick={() => removeMovement(movement, index)}
                        >
                          ✕
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className='relative'>
                    {currentSection === index && filteredMovements && filteredMovements.length > 0 && (
                      <Dropdown
                        array={filteredMovements}
                        action={addMovement}
                      />
                    )}
                  </div>
                </div>
                <div className='w-full space-y-2'>
                  <label htmlFor={`notes-${index}`}>NOTES:</label>
                  <textarea
                    className='w-full min-h-24 p-2'
                    onChange={(e) => handleSectionChange(e, index)}
                    type="text"
                    name="notes"
                    id={`notes-${index}`}
                    placeholder="Notes"
                    value={section.notes}
                  />
                </div>
                  <button
                    type='button'
                    className='w-full my-2 uppercase bg-red-600 text-white px-4 py-2 duration-300 hover:bg-red-500'
                    onClick={() => removeSection(index)}
                  >
                    Remove Section
                  </button>
              </div>
            ))}
          </div>
        </div>

        {isThereAWorkout && <div className='grid md:grid-cols-2 gap-4 mt-8 px-6'>
          <DeletePopup deletePopup={deletePopup} setDeletePopup={setDeletePopup} workoutId={newWorkout._id} />
          <button
            type='button'
            className='w-full bg-red-600 text-center text-white px-4 py-2 rounded-md duration-300 hover:bg-red-500'
            onClick={() => setDeletePopup(true)}
            >
            REMOVE WORKOUT
          </button>
          <button type="submit" className='button__submit'>SUBMIT</button>
        </div>}
      </form>
    </>
  )
}
