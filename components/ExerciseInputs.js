'use client'
import { useState } from 'react'

const ExerciseInputs = ({ handleSectionChange, handleExerciseChange, addExercise, exercise, section }) => {
  const [numberOfSections, setNumberOfSections] = useState(1)
    
  return (
    <>
      <label htmlFor="section">STEP 1 - Add Section Name</label>
      <input type="text" name="section" onChange={handleSectionChange} value={section.section} />
      
      <p>STEP 2 - Add All Exercises</p>
      <div className='my-4 border-2 flex flex-col gap-2 p-4 rounded-md'>
        <label htmlFor="name" >Only Exercise Name Here:</label>
        <input type="text" name="name"  onChange={handleExerciseChange} value={exercise.name} />

        <label htmlFor="description">Description / rep Scheme:</label>
        {/* <input type="text" name="description" onChange={handleExerciseChange} value={exercise.description}  /> */}
        <textarea name="description" onChange={handleExerciseChange} value={exercise.description} className='border border-gray-300 rounded-md p-2'/>
        
        <label htmlFor="video">Demo Video Link:</label>
        <input type="text" name="video" onChange={handleExerciseChange} value={exercise.video}  />

        <button onClick={addExercise} type="button" className='bg-black rounded-md py-2 mt-4 mb-4 text-white'>ADD EXERCISE</button>
      </div>
      
      <label htmlFor="notes">Step 3- Add Section Notes</label>
      {/* <input type="text" name="notes" onChange={handleSectionChange} value={section.notes ? section.notes : ''} /> */}
      <textarea name="notes" onChange={handleSectionChange} value={section.notes ? section.notes : ''} className='border border-gray-300 rounded-md p-2'/>
    </>
  )
}

export default ExerciseInputs
