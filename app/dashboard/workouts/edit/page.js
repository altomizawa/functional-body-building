"use client"
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster"
import DeletePopup from '@/components/DeletePopup'
import Dropdown from '@/components/form/Dropdown'
import useEditWorkout from '@/hooks/use-edit-workout'
import WorkoutForm from '@/components/workout-form/index.js'
import FetchWorkoutForm from '@/components/fetch-workout-form'

export default function EditWorkoutForm() {
  const {
    filteredMovements,
    currentSection,
    searchText,
    deletePopup,
    isThereAWorkout,
    newWorkout,
    onSubmit,
    handleWorkoutChange,
    handleSectionChange,
    handleMovementSearch,
    addMovement,
    removeMovement,
    addNewSection,
    removeSection,
    selectSection,
    getWorkout,
    movementInputRef,
    setDeletePopup
  } = useEditWorkout();

  return (
    <>
      <Toaster />
      <FetchWorkoutForm getWorkout={getWorkout} />

      <WorkoutForm.Container onSubmit={onSubmit}>
        
        {/* FORM */}
        {newWorkout && <div>
          <WorkoutForm.Title>EDIT WORKOUT</WorkoutForm.Title>
          <div className='flex items-center gap-2 mt-4'>
            <input
              className='w-[300px]'
              onChange={handleWorkoutChange}
              type="text"
              name="program"
              placeholder="Program"
              value={newWorkout?.program || ''}
              required
            />
            <input
              className='w-16'
              onChange={handleWorkoutChange}
              type="number"
              name="week"
              placeholder="Week"
              value={newWorkout?.week || ''}
              min={1}
              required
            />
            <input
              className='w-16'
              onChange={handleWorkoutChange}
              type="number"
              name="day"
              placeholder="Day"
              value={newWorkout?.day || ''}
              max={7}
              min={1}
              required
            />
          </div>

          {/* Section tabs */}
          <WorkoutForm.Title variant='small' className='mt-12'>SECTIONS:</WorkoutForm.Title>
          <WorkoutForm.Sections>
            {newWorkout && newWorkout.sections.map((section, index) => (
              <WorkoutForm.Button key={index} type='button' variant={currentSection === index ? 'ghost' : 'secondary'} onClick={() => selectSection(index)}>
                 {section.section}
              </WorkoutForm.Button>
            ))}
            <WorkoutForm.Button type="button" variant='primary' onClick={addNewSection}>
              + Add Section
            </WorkoutForm.Button>
          </WorkoutForm.Sections>

          <WorkoutForm.SectionWrapper>
            {/* SECTION */}
            {newWorkout && newWorkout.sections.map((section, index) => (
              <WorkoutForm.Section key={index} currentSection={currentSection} index={index}>
                <div className='w-full space-y-2'>
                  <label htmlFor={`section-${index}`}>SECTION NAME:</label>
                  <input
                    className='w-full '
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
                    className='w-full min-h-64 p-2'
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
                    autoComplete='off'
                    name="movements"
                    id={`movements-${index}`}
                    placeholder="Search movements"
                    value={currentSection === index ? searchText : ''}
                    ref={currentSection === index ? movementInputRef : null}
                  />
                  <div className='flex flex-wrap gap-4'>
                    {section.movements && section.movements.map((movement, movIdx) => (
                      <div key={movIdx} className='border-[1px] border-white/20 px-2 py-1 flex items-center'>
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
                    {currentSection === index && !filteredMovements && searchText && (
                      <div className='flex justify-end'>
                        <button>+ Add new movement to DB</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='w-full space-y-2'>
                  <label htmlFor={`notes-${index}`}>NOTES:</label>
                  <textarea
                    className='w-full min-h-48 p-2'
                    onChange={(e) => handleSectionChange(e, index)}
                    type="text"
                    name="notes"
                    id={`notes-${index}`}
                    placeholder="Notes"
                    value={section.notes}
                  />
                </div>
                <WorkoutForm.Button type='button' variant='danger' onClick={() => removeSection(index)}>
                   REMOVE SECTION
                </WorkoutForm.Button>
              </WorkoutForm.Section>
            ))}
          </WorkoutForm.SectionWrapper>
        </div>}

        {isThereAWorkout && <WorkoutForm.Buttons>
          <DeletePopup deletePopup={deletePopup} setDeletePopup={setDeletePopup} workoutId={newWorkout._id} />
          <WorkoutForm.Button variant='danger' type='button 'onClick={() => setDeletePopup(true)}>
            REMOVE WORKOUT
          </WorkoutForm.Button>
          <WorkoutForm.Button variant='ghost' type='submit'>
            SUBMIT
          </WorkoutForm.Button>
        </WorkoutForm.Buttons>}
      </WorkoutForm.Container>
    </>
  )
}
