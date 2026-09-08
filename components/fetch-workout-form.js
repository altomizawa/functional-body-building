'use client'
import React, { useState } from 'react'
import { PROGRAM_LIST, MAX_WEEKS, MAX_DAYS } from '@/lib/constants'
import WorkoutForm from './workout-form'
import { useSearchParams } from 'next/navigation'

const FetchWorkoutForm = ({ getWorkout }) => {
  const [workoutType, setWorkoutType] = useState('pillars')
  const searchParams = useSearchParams()
  console.log('searchParams: ', searchParams.keys())

  return (
    <div className='w-full my-8 max-w-[1440px] mx-auto border-b border-neutral-800 pb-8'>
      {/* Workout Type Selector */}
      <div className="flex justify-center items-center gap-3 mb-6">
        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">WORKOUT TYPE:</span>
        <div className="flex gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => setWorkoutType('pillars')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${workoutType === 'pillars'
              ? 'bg-white text-black shadow'
              : 'text-neutral-400 hover:text-white'
              }`}
          >
            Pillars
          </button>
          <button
            type="button"
            onClick={() => setWorkoutType('pump4x')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${workoutType === 'pump4x'
              ? 'bg-white text-black shadow'
              : 'text-neutral-400 hover:text-white'
              }`}
          >
            Pump 4x
          </button>
        </div>
      </div>

      <form action={getWorkout} className='flex flex-wrap gap-4 items-center justify-center'>
        <input type="hidden" name="workoutType" value={workoutType} />

        {workoutType === 'pillars' ? (
          <>
            <label htmlFor="selectedProgram" className="text-sm font-semibold uppercase text-neutral-300">
              PROGRAM:
              <select name='selectedProgram' className='ml-3 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white'>
                {PROGRAM_LIST.map((program, index) => (
                  <option key={index} value={program} className='bg-black'>{program}</option>
                ))}
              </select>
            </label>
            <label htmlFor="selectedWeek" className="text-sm font-semibold uppercase text-neutral-300">
              WEEK:
              <select name='selectedWeek' className='ml-3 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white'>
                {Array.from({ length: MAX_WEEKS }, (_, index) => index + 1).map((weekNum) => (
                  <option key={weekNum} value={weekNum} className='bg-black'>{weekNum}</option>
                ))}
              </select>
            </label>
            <label htmlFor="selectedDay" className="text-sm font-semibold uppercase text-neutral-300">
              DAY:
              <select name='selectedDay' className='ml-3 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white'>
                {Array.from({ length: MAX_DAYS }, (_, index) => index + 1).map((dayNum) => (
                  <option key={dayNum} value={dayNum} className='bg-black'>{dayNum}</option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label htmlFor="selectedDate" className="text-sm font-semibold uppercase text-neutral-300 flex items-center">
            WORKOUT DATE:
            <input
              type="date"
              name="selectedDate"
              defaultValue={new Date().toISOString().split('T')[0]}
              className='ml-3 bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-white'
              required
            />
          </label>
        )}

        <WorkoutForm.Button type='submit' variant='ghost' className='ml-2'>
          Fetch Workout
        </WorkoutForm.Button>
      </form>
    </div>
  )
}

export default FetchWorkoutForm
