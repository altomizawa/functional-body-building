import React from 'react'
import { PROGRAM_LIST, MAX_WEEKS, MAX_DAYS } from '@/lib/constants'
import WorkoutForm from './workout-form'

const FetchWorkoutForm = ({ getWorkout}) => {
  return (
    <form action={getWorkout} className='h-full w-full my-16 max-w-[1440px] mx-auto flex gap-4 justify-center border-b-2 pb-8'>
        <label htmlFor="selectedProgram" >CHOOSE A PROGRAM:
        <select name='selectedProgram' className='ml-4'>
          {PROGRAM_LIST.map((program, index) => (
            <option key={index} value={program}>{program}</option>
          ))}
        </select>
        </label>
        <label htmlFor="selectedWeek">WEEK:
          <select name='selectedWeek' className='ml-4'>
            {Array.from({ length: MAX_WEEKS }, (_, index) => index + 1).map((program, index) => (
              <option key={index} value={program}>{program}</option>
            ))}
          </select>
        </label>
        <label htmlFor="selectedDay">DAY:
          <select name='selectedDay' className='ml-4'>
            {Array.from({ length: MAX_DAYS }, (_, index) => index + 1).map((program, index) => (
              <option key={index} value={program}>{program}</option>
            ))}
          </select>
        </label>
      <WorkoutForm.Button type='submit' variant='ghost'>
        Fetch Workout
      </WorkoutForm.Button>
    </form>
  )
}

export default FetchWorkoutForm
