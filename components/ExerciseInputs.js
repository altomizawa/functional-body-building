'use client'
import { useState } from 'react'

const ExerciseInputs = ({ handleSectionChange, handleExerciseChange, addExercise, exercise }) => {
  const [numberOfSections, setNumberOfSections] = useState(1)
    
  return (
    <>
      <label htmlFor="section">Section</label>
      <input type="text" name="section" onChange={handleSectionChange} />
      
      <div className='m-4 border-2 flex flex-col gap-2 p-4'>
        <label htmlFor="name" >Only Exercise Name Here:</label>
        <input type="text" name="name"  onChange={handleExerciseChange} value={exercise.name} />

        <label htmlFor="description">Description / rep Scheme:</label>
        <input type="text" name="description" onChange={handleExerciseChange} value={exercise.description}  />
        
        <label htmlFor="video">Demo Video Link:</label>
        <input type="text" name="video" onChange={handleExerciseChange} value={exercise.video}  />

        <button onClick={addExercise} type="button" className='bg-black rounded-md py-2 mt-4 mb-4 text-white'>ADD EXERCISE</button>
      </div>
      
      <label htmlFor="notes">Notes</label>
      <input type="text" name="notes" onChange={handleSectionChange} />

    </>
  )
}

export default ExerciseInputs
