'use client'
import { useState, useEffect } from 'react'
import WorkoutIntroInputs from './WorkoutIntroInputs'
import ExerciseInputs from './ExerciseInputs'

const AddNewWorkoutForm = () => {  
  //Create empty object to store new workout data
  const [movements, setMovements] = useState([])
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

    fetch(`${process.env.BASE_URL}/api/programs/pillars/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newWorkout)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 404) {
        window.alert(data.message)
      } else {
        console.log(data)
      }
    })
    .catch(err => console.log('Error:', err.message, 'Status:', err.status))
    .finally(() => {
      setNewWorkout({})
      setSectionNumber(0)
    })
  }

  // RESET FORM
  const resetForm = () => {
    setNewWorkout({})
    setSectionNumber(0)
  }

  // HANDLE FIRST SECTION CHANGES
  const handleChange = (e) => {
    setNewWorkout( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  // HANDLE SECTION CHANGES
  const handleSectionChange = (e) => {
    setSection( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  // HANDLE EXERCISES CHANGES
  const handleExerciseChange = (e) => {
    setExercise( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
    const currentMovement = movements.find(movement => movement.name === e.target.value.toLowerCase())
    if (currentMovement){
      console.log('found')
    } else console.log('not found')
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
    const exerciseInput = document.getElementById('exercise-name')
    exerciseInput && exerciseInput.focus()
  }

  useEffect(() => {
    fetch(`${process.env.BASE_URL}/api/movements`)
    .then(res => res.json())
    .then(data => setMovements(data))
    .catch(err => console.log(err))
  }, [])

  return (
    <div className='w-[90%] mx-auto block md:grid md:grid-cols-2 justify-center'>
      <form name="newWorkout" onSubmit={getFormData} className='flex flex-col w-[50%] min-w-[400px] space-y-4'>
        <h2 className='text-2xl font-bold'>Add New Workout</h2>
        
        {sectionNumber === 0 ? 
          <WorkoutIntroInputs handleChange={handleChange} /> 
          : <ExerciseInputs 
              handleSectionChange={handleSectionChange} 
              handleExerciseChange={handleExerciseChange} 
              addExercise={addExercise} exercise={exercise}
              section={section}
              movements={movements}
            />}


        <button type="button" onClick={addSection} className='bg-gray-500 text-white rounded-md p-2 w-max justify-self-end'>+ SECTION</button>
        {/* {sectionNumber > 0 && <button type="button" onClick={()=>{setSectionNumber(0)}} className='bg-red-700 text-white rounded-md p-2 mt-12'>BACK</button>} */}
        <div className='flex gap-4'>
          <button type="button" onClick={resetForm} className='bg-red-500 text-white rounded-md p-2 w-full duration-500 hover:bg-red-400'>RESET</button>
          <button type="submit"className='bg-green-500 text-white rounded-md p-2 w-full duration-500 hover:bg-green-400'>SUBMIT</button>
        </div>
      </form>

      {/* PREVIEW WORKOUT */}

      <div className='space-y-2 border-2 my-4 p-4 rounded-md'>
        <h2 className='font-bold uppercase text-xl underline w-full'>PREVIEW</h2>
        <h3>Date:</h3>
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
