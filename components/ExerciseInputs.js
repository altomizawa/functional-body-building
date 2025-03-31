'use client'
import { useState, useEffect } from 'react'

// import movements from '@/lib/movements'

const ExerciseInputs = ({ handleSectionChange, handleExerciseChange, addExercise, exercise, section, movements }) => {
  const [numberOfSections, setNumberOfSections] = useState(1)
  const [isItExercise, setIsItExercise] = useState(true)
  const orderedMovements = movements.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <label htmlFor="section">STEP 1 - Add Section Name</label>
      <input type="text" name="section" onChange={handleSectionChange} value={section.section} />
      
      <p>STEP 2 - Add All Exercises</p>
      <div className='my-4 border-2 flex flex-col gap-2 p-4 rounded-md overflow-hidden'>
        <label htmlFor="name" >Only Text Here:</label>
        <input type="text" name="name"  onChange={handleExerciseChange} value={exercise.name} id="exercise-name" />

        <label htmlFor="description">Description / rep Scheme:</label>
        {/* <input type="text" name="description" onChange={handleExerciseChange} value={exercise.description}  /> */}
        <textarea name="description" onChange={handleExerciseChange} value={exercise.description} className='border border-gray-300 rounded-md p-2'/>
        

        <label htmlFor="video">Demo Video:</label>
        <select className='border-2 py-2 px-2 text-sm' name="video" onChange={handleExerciseChange}>
          <option value="">Select a Movement</option>
          {orderedMovements.map((movement, index) => (
            <option key={index} value={movement.link}>{movement.name}</option>)
          )}
        </select>

        <button onClick={addExercise} type="button" className='bg-black rounded-md py-2 mt-4 mb-4 text-white'>ADD EXERCISE</button>
      </div>
      
      <label htmlFor="notes">Step 3- Add Section Notes</label>
      {/* <input type="text" name="notes" onChange={handleSectionChange} value={section.notes ? section.notes : ''} /> */}
      <textarea name="notes" onChange={handleSectionChange} value={section.notes ? section.notes : ''} className='border border-gray-300 rounded-md p-2'/>
    </>
  )
}

export default ExerciseInputs
