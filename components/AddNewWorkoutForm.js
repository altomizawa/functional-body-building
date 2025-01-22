'use client'
import { useState } from 'react'
import WorkoutIntroInputs from './WorkoutIntroInputs'
import ExerciseInputs from './ExerciseInputs'
import { set } from 'mongoose'

const AddNewWorkoutForm = () => {  
  //Create empty object to store new workout data
  const [newWorkout, setNewWorkout] = useState({})
  const [sectionNumber, setSectionNumber] = useState(0)
  const [exerciseNumber, setExerciseNumber] = useState(0)
  const [exercise, setExercise] = useState({
    name: '',
    description: ' ',
    video: ''
  })
  const [section, setSection] = useState({
    section: '',
    icon: '',
    exercises: []
  })

 function getFormData(e) {
    e.preventDefault()

    // fetch('/api/programs/pillars/workouts', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(newWorkout)
    // })
    // .then(res => res.json())
    // .then(data => console.log(data))
    // .catch(err => console.log(err))
    // setNewWorkout(...newWorkout, section)

    console.log(newWorkout)
  }

  const handleChange = (e) => {
    console.log(e.target.value, e.target.name)
    setNewWorkout( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  // HANDLE SECTION CHANGES
  const handleSectionChange = (e) => {
    console.log(e.target.name, e.target.value)
    setSection( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
    console.log(section)
    // addSectionValue(e.target.value)
  }

  // HANDLE EXERCICES CHANGES
  const handleExerciseChange = (e) => {
    console.log(e.target.value, e.target.name)
    setExercise( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })

    // setExercise( prev => {
    //   return {
    //     ...prev,
    //     [e.target.name]: e.target.value
    //   }
    // })
  }

  // ADD SECTION TO WORKOUT
  const addSectionValue = (value) => {
    setNewWorkout( prev => {
      return {
        ...prev,
        workout: [
          {
            section: value,
            icon: 'ideaIcon',
            exercises: []
          }
          ]
      }
    })
  }

  // INSERT NEW SECTION
  const addSection = () => {
    setSectionNumber(prev => prev + 1)
    {newWorkout.workout ? setNewWorkout( prev => {
      return {
        ...prev,
        workout: [...prev.workout, section]
      }
    }) : setNewWorkout( prev => {
      return {
        ...prev,
        workout: [section]
      }
    })}
    
    setSection({
      section: '',
      icon: '',
      exercises: []
    })
  }


  // ADD EXERCISE TO SECTION
  const addExercise = () => {
    // newWorkout.workout[sectionNumber-1].exercises.push(exercise)
    setSection( prev => {
      return {
        ...prev,
        exercises: [...prev.exercises, exercise]
      }
    })
    setExercise({
      name: '',
      description: ' ',
      video: ''
    })
  }

  return (
    <div className='w-[90%] mx-auto flex justify-center'>
      <form name="newWorkout" onSubmit={getFormData} className='flex flex-col w-[50%] min-w-[400px]'>
        <h2 className='text-2xl font-bold'>Add New Workout</h2>
        
        {sectionNumber === 0 ? 
          <WorkoutIntroInputs handleChange={handleChange} /> 
          : <ExerciseInputs 
              handleSectionChange={handleSectionChange} 
              handleExerciseChange={handleExerciseChange} 
              addExercise={addExercise} exercise={exercise}
            />}

        <div className='grid grid-cols-2 w-full justify-center gap-4 mt-8'>
          <button type="button" onClick={addSection} className='bg-gray-500 text-white rounded-md p-2'>ADD SECTION</button>
          {/* <button type="button" onClick={nextStep} className='bg-gray-500 text-white rounded-md p-2'>NEXT</button> */}
          <button type="submit"className='bg-gray-500 text-white rounded-md p-2'>FINISH</button>
        </div>
        {sectionNumber > 0 && <button type="button" onClick={()=>{setSectionNumber(0)}} className='bg-red-700 text-white rounded-md p-2 mt-12'>BACK</button>}
      </form>
    </div>
  )
}

export default AddNewWorkoutForm
