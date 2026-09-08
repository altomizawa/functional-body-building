'use client'
import React, { useState, useEffect } from 'react'
import { PROGRAM_LIST, MAX_WEEKS, MAX_DAYS } from '@/lib/constants'
import WorkoutForm from './workout-form'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const FetchWorkoutForm = ({ getWorkout }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentWorkoutType = searchParams.get('workoutType') || 'pillars'
  const currentProgram = searchParams.get('selectedProgram') || PROGRAM_LIST[0]
  const currentWeek = searchParams.get('selectedWeek') || '1'
  const currentDay = searchParams.get('selectedDay') || '1'
  const currentDate = searchParams.get('selectedDate') || new Date().toISOString().split('T')[0]

  const [workoutType, setWorkoutType] = useState(currentWorkoutType)
  const [selectedProgram, setSelectedProgram] = useState(currentProgram)
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)
  const [selectedDay, setSelectedDay] = useState(currentDay)
  const [selectedDate, setSelectedDate] = useState(currentDate)

  // Sync state if searchParams in the URL change
  useEffect(() => {
    const typeFromUrl = searchParams.get('workoutType')
    if (typeFromUrl) setWorkoutType(typeFromUrl)

    const programFromUrl = searchParams.get('selectedProgram')
    if (programFromUrl) setSelectedProgram(programFromUrl)

    const weekFromUrl = searchParams.get('selectedWeek')
    if (weekFromUrl) setSelectedWeek(weekFromUrl)

    const dayFromUrl = searchParams.get('selectedDay')
    if (dayFromUrl) setSelectedDay(dayFromUrl)

    const dateFromUrl = searchParams.get('selectedDate')
    if (dateFromUrl) setSelectedDate(dateFromUrl)
  }, [searchParams])

  // Automatically fetch workout on mount if search params are present in URL
  useEffect(() => {
    const type = searchParams.get('workoutType')
    if (!type) return

    if (
      (type === 'pillars' && searchParams.get('selectedProgram') && searchParams.get('selectedWeek') && searchParams.get('selectedDay')) ||
      (type === 'pump4x' && searchParams.get('selectedDate'))
    ) {
      getWorkout(searchParams)
    }
  }, [])

  const handleFetchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('workoutType', workoutType)

    if (workoutType === 'pillars') {
      params.set('selectedProgram', selectedProgram)
      params.set('selectedWeek', selectedWeek)
      params.set('selectedDay', selectedDay)
    } else {
      params.set('selectedDate', selectedDate)
    }

    router.replace(`${pathname}?${params.toString()}`)
    getWorkout(params)
  }

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

      <form onSubmit={handleFetchSubmit} className='flex flex-wrap gap-4 items-center justify-center'>
        <input type="hidden" name="workoutType" value={workoutType} />

        {workoutType === 'pillars' ? (
          <>
            <label htmlFor="selectedProgram" className="text-sm font-semibold uppercase text-neutral-300">
              PROGRAM:
              <select
                name='selectedProgram'
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className='ml-3 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white'
              >
                {PROGRAM_LIST.map((program, index) => (
                  <option key={index} value={program} className='bg-black'>{program}</option>
                ))}
              </select>
            </label>
            <label htmlFor="selectedWeek" className="text-sm font-semibold uppercase text-neutral-300">
              WEEK:
              <select
                name='selectedWeek'
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className='ml-3 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white'
              >
                {Array.from({ length: MAX_WEEKS }, (_, index) => index + 1).map((weekNum) => (
                  <option key={weekNum} value={weekNum} className='bg-black'>{weekNum}</option>
                ))}
              </select>
            </label>
            <label htmlFor="selectedDay" className="text-sm font-semibold uppercase text-neutral-300">
              DAY:
              <select
                name='selectedDay'
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className='ml-3 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white'
              >
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
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
