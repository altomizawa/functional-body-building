'use client'
import { useEffect, useState } from 'react';
import { PROGRAM_LIST, MAX_WEEKS, MAX_DAYS } from '@/lib/constants';

const WorkoutNavigation = ({ program, week, day, handleFetchWorkout }) => {
  const [currentWorkout, setCurrentWorkout] = useState({
    week: week,
    day: day,
    programIndex: 0
  });
  

  const nextProgram = () => {
    if (currentWorkout.programIndex < PROGRAM_LIST.length - 1) {
      setCurrentWorkout(prev => ({
        ...prev,
        programIndex: prev.programIndex + 1
      }));
    } else return
  }
  const previousProgram = () => {
    if (currentWorkout.programIndex > 0) {
      setCurrentWorkout(prev => ({
        ...prev,
        programIndex: prev.programIndex - 1
      }));
    } else return
  }
  const nextWeek = () => {
    if (currentWorkout.week < MAX_WEEKS) {
      setCurrentWorkout(prev => ({
        ...prev,
        week: prev.week + 1
      }));
      handleFetchWorkout(program, week+1, day)
    } else return
  }
  const previousWeek = () => {
    if (currentWorkout.week > 1) {
      setCurrentWorkout(prev => ({
        ...prev,
        week: prev.week - 1
      }));
      handleFetchWorkout(program, week-1, day)

    } else return
  }
  const nextDay = () => {
    if (currentWorkout.day < MAX_DAYS) {
      setCurrentWorkout(prev => ({
        ...prev,
        day: prev.day + 1
      }));
      handleFetchWorkout(program, week, day+1)

    } else return
  }
  const previousDay = () => {
    if (currentWorkout.day > 1) {
      setCurrentWorkout(prev => ({
        ...prev,
        day: prev.day - 1
      }));
      handleFetchWorkout(program, week, day-1)

    } else return
  }

  // useEffect(() => {
  //   console.log(workout)
  // }, []);

 
  return (
    <>
      <div className="flex justify-center items-center gap-8 py-4 bg-black">
        <button onClick={previousProgram} className='workout-button'>&lt;</button>
        <p className="uppercase text-white text-xl">{program}</p>
        <button onClick={nextProgram} className='workout-button'>&gt;</button>
      </div>
      
      <div className="flex gap-12 justify-center items-center bg-slate-400 py-2">
        <div className="flex items-center gap-4 w-max">
          <button onClick={previousWeek} className='workout-button'>&lt;</button>
          <p className="uppercase text-white text-xl">WEEK {week}</p>
          <button onClick={nextWeek} className='workout-button'>&gt;</button>
        </div>
        
        <div className="flex items-center gap-4 w-max">
          <button onClick={previousDay} className='workout-button'>&lt;</button>
          <p className="uppercase text-white text-xl">DAY {day}</p>
          <button onClick={nextDay} className='workout-button'>&gt;</button>
        </div>
      </div>
    </>
  )
}

export default WorkoutNavigation
