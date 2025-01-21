'use client'
import { useState } from 'react'

const AddNewWorkoutForm = () => {  
  //Create empty object to store new workout data
  const [newWorkout, setNewWorkout] = useState({})

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
  }

  const handleChange = (e) => {
    console.log(e.target.value)
    setNewWorkout( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  return (
    <div className='w-[90%] mx-auto flex justify-center'>
      <form name="newWorkout" onSubmit={getFormData} className='flex flex-col w-[50%] min-w-[400px]'>
        <h2 className='text-2xl font-bold'>Add New Workout</h2>
        <label htmlFor="date">Workout Date</label>
        <input type="date" name="date" onChange={handleChange}/>
        <label htmlFor="program">Program Type</label>
        <input type="string" name="program" onChange={handleChange} />
        <label htmlFor="week">Week</label>
        <input type="number" name="week"  onChange={handleChange} />
        <label htmlFor="day">Day</label>
        <input type="number" name="day" onChange={handleChange} />
        <button type="submit" className='bg-gray-500 text-white rounded-md p-2'>Submit</button>
      </form>
    </div>
  )
}

export default AddNewWorkoutForm
