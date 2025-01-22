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
    exercises: [],
  })

 function getFormData(e) {
    e.preventDefault()

    fetch('/api/programs/pillars/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newWorkout)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))


    // setNewWorkout(...newWorkout, section) // I don't think this line is needed...

    console.log(newWorkout)
  }

  // HANDLE FIRST SECTION CHANGES
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

  // HANDLE EXERCISES CHANGES
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
            exercises: [],
            notes: ''
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
        workout: []
      }})
    }

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
      <form name="newWorkout" onSubmit={getFormData} className='flex flex-col w-[50%] min-w-[400px] space-y-4'>
        <h2 className='text-2xl font-bold'>Add New Workout</h2>
        
        {sectionNumber === 0 ? 
          <WorkoutIntroInputs handleChange={handleChange} /> 
          : <ExerciseInputs 
              handleSectionChange={handleSectionChange} 
              handleExerciseChange={handleExerciseChange} 
              addExercise={addExercise} exercise={exercise}
              section={section}
            />}

        <div className='grid grid-cols-2 w-full justify-center gap-4 mt-8'>
          <button type="button" onClick={addSection} className='bg-gray-500 text-white rounded-md p-2'>ADD SECTION</button>
          {/* <button type="button" onClick={nextStep} className='bg-gray-500 text-white rounded-md p-2'>NEXT</button> */}
          <button type="submit"className='bg-gray-500 text-white rounded-md p-2'>FINISH</button>
        </div>
        {/* {sectionNumber > 0 && <button type="button" onClick={()=>{setSectionNumber(0)}} className='bg-red-700 text-white rounded-md p-2 mt-12'>BACK</button>} */}
      </form>
      <div className='pl-8 space-y-2'>
        <h2 className='font-bold uppercase text-xl underline'>PREVIEW</h2>
        <h3>Data:</h3>
        <p>{newWorkout.date}</p>
        <h3>Program Type:</h3>
        <p>{newWorkout.program}</p>
        <h3>Week:</h3>
        <p>{newWorkout.week}</p>
        <h3>Day:</h3>
        <p>{newWorkout.day}</p>
        {newWorkout.workout && newWorkout.workout.map((section, index) => {
          return (
            <div key={index}>
              {/* <h3>Section {index + 1}</h3> */}
              <h3 className='uppercase'>{section.section}</h3>
              {section.exercises.map((exercise, index) => {
                return (
                  <div key={index}>
                    <p>{exercise.name}</p>
                    <p>{exercise.description}</p>
                    <p>{exercise.video}</p>
                  </div>
                )
              })}
              {section.notes && (
                <>
                  <h3>{section.section} Notes</h3>
                  <p>{section.notes}</p>
                </>
              )}
            </div>)
        }
        )}
        {/* <pre>{JSON.stringify(newWorkout, null, 2)}</pre> */}
      </div>
    </div>
  )
}

export default AddNewWorkoutForm
