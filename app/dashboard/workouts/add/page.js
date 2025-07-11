"use client"

import { useState, useEffect, useRef } from "react"
import Preview from '@/components/Preview'
import Link from 'next/link'
import { createWorkout, getAllMovements } from '@/lib/actions'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'

export default function AddWorkoutForm() {
  const [movements, setMovements] = useState([])
  const [filteredMovements, setFilteredMovements] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [searchText, setSearchText] = useState('')

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
      sections: [{
        section: '',
        icon: '',
        description: '',
        movements: [],
        notes: ''
      }]
    })
    setCurrentSection(0)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log(newWorkout)
    try {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create workout',
      })
      console.error(error)
    }
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
    <form onSubmit={onSubmit} className='h-full px-6 my-16 max-w-[1440px] mx-auto'>
      <Link href="/" className='flex item-center justify-center w-min mb-12 '>
        <span className="material-symbols-outlined">arrow_back</span>BACK
      </Link>
      {/* FORM */}
      <div>
        <Toaster />
        <h1 className="text-2xl md:text-3xl font-bold text-left">ADD NEW WORKOUT</h1>
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
                  className='w-full min-h-48 p-2 border-2'
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
                    <ul className='absolute top-0 left-0 z-10 w-full bg-white border-[1px] border-black/20 shadow-md max-h-60 overflow-y-auto'>
                      {filteredMovements.map((movement, movIdx) => (
                        <li
                          key={movIdx}
                          className='px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white'
                          onClick={() => addMovement(movement)}
                        >
                          {movement.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className='w-full space-y-2'>
                <label htmlFor={`notes-${index}`}>NOTES:</label>
                <textarea
                  className='w-full min-h-24 p-2 border-2'
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
              {/* <div className="flex justify-between">
                <button
                  type='button'
                  className='button__main-menu my-2 uppercase bg-green-500 text-white px-4 py-2'
                  onClick={addNewSection}
                >
                  Add Section
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-4 mt-8'>
        
        <button type="submit" className='button__submit'>SUBMIT</button>
      </div>
    </form>
  )
}
