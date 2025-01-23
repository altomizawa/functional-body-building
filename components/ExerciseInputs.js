'use client'
import { useState } from 'react'

import movements from '@/lib/movements'

const ExerciseInputs = ({ handleSectionChange, handleExerciseChange, addExercise, exercise, section }) => {
  const [numberOfSections, setNumberOfSections] = useState(1)
  const [isItExercise, setIsItExercise] = useState(true)
  const orderedMovements = movements.sort((a, b) => a.name.localeCompare(b.name))

  // CREATE VIDEO LINK
  const createVideoLink = (name) => {
    const movement = movements.find((item=> item.name === name))
    return console.log(movement)
  }
    
  return (
    <>
      <label htmlFor="section">STEP 1 - Add Section Name</label>
      <input type="text" name="section" onChange={handleSectionChange} value={section.section} />
      
      <p>STEP 2 - Add All Exercises</p>
      <div className='my-4 border-2 flex flex-col gap-2 p-4 rounded-md overflow-hidden'>
        <div className='flex justify-center items-center gap-2'>
          <p className={`${!isItExercise && 'font-bold'}`}>TEXT</p>
          <button onClick={() => setIsItExercise(prev => !prev)} className='h-8 w-16 bg-gray-200 rounded-full flex relative'>
            <div className={`w-1/2 absolute top-[50%] translate-y-[-50%] left-0 h-[90%] aspect-square border-2 rounded-full bg-white ${isItExercise ? "translate-x-[100%]" : "translate-x-[0]"}`}></div>
          </button>
          <p className={`${isItExercise && 'font-bold'}`}>EXERCISE</p>
        </div>
        {
          isItExercise ? (
            <>
              <label htmlFor="name" >CHOOSE MOVEMENT:</label>
              <select className='border-2 py-2 px-2 text-sm' name="name" onChange={handleExerciseChange} >
                {orderedMovements.map((movement, index) => (
                  <option key={index} value={movement.name} >{movement.name}</option>)
                )}
              </select>
              {/* <input type="text" name="name" onChange={handleExerciseChange} value={exercise.name} /> */}
            </>
          ) : (
            <>
              {/* TEXT FORM */}
              <label htmlFor="name" >Only Text Here:</label>
              <input type="text" name="name"  onChange={handleExerciseChange} value={exercise.name} />
            </>
          )
        }
       

        <label htmlFor="description">Description / rep Scheme:</label>
        {/* <input type="text" name="description" onChange={handleExerciseChange} value={exercise.description}  /> */}
        <textarea name="description" onChange={handleExerciseChange} value={exercise.description} className='border border-gray-300 rounded-md p-2'/>
        
        {isItExercise && 
          <>
          <label htmlFor="video">Demo Video:</label>
          <select className='border-2 py-2 px-2 text-sm' name="video" onChange={handleExerciseChange} >
            {orderedMovements.map((movement, index) => (
              <option key={index} value={movement.link} >{movement.name}</option>)
            )}
        </select>
          </>
        }
        {/* <input type="text" name="video" onChange={handleExerciseChange} value={exercise.link} placeholder={exercise.name}  /> */}

        <button onClick={addExercise} type="button" className='bg-black rounded-md py-2 mt-4 mb-4 text-white'>ADD EXERCISE</button>
      </div>
      
      <label htmlFor="notes">Step 3- Add Section Notes</label>
      {/* <input type="text" name="notes" onChange={handleSectionChange} value={section.notes ? section.notes : ''} /> */}
      <textarea name="notes" onChange={handleSectionChange} value={section.notes ? section.notes : ''} className='border border-gray-300 rounded-md p-2'/>
    </>
  )
}

export default ExerciseInputs
