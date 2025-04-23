'use client'
import { useEffect, useState } from 'react';
import { PROGRAM_LIST, MAX_WEEKS, MAX_DAYS } from '@/lib/constants';
import { useSearchParams, useRouter } from 'next/navigation';
import { parse } from 'date-fns';


const WorkoutNavigation = ({ program, week, day, handleFetchWorkout }) => {
  const [currentWorkout, setCurrentWorkout] = useState({
    week: week,
    day: day,
    programIndex: 0
  });
  
  const searchParams = useSearchParams();
  const router = useRouter();


  const nextProgram = () => {
    if (program < PROGRAM_LIST.length - 1) {
      const nextProgram = parseInt(program) + 1;
      router.push(`/programs/pillars?program=${nextProgram}&week=${week}&day=${day}`);

    } else return
  }
  const previousProgram = () => {
    if (program > 0) {
      const previousProgram = parseInt(program) - 1;
      router.push(`/programs/pillars?program=${previousProgram}&week=${week}&day=${day}`);
    } else return
  }
  const nextWeek = () => {
    if (week < MAX_WEEKS) {
      const nextWeek = parseInt(week) + 1;
      router.push(`/programs/pillars?program=${program}&week=${nextWeek}&day=${day}`);
    } else return
  }
  const previousWeek = () => {
    if (week > 1) {
      const previousWeek = parseInt(week) - 1;
      router.push(`/programs/pillars?program=${program}&week=${previousWeek}&day=${day}`);
    } else return
  }
  const nextDay = () => {
    if (day < MAX_DAYS) {
      const nextDay = parseInt(day) + 1;
      router.push(`/programs/pillars?program=${program}&week=${week}&day=${nextDay}`);
    } else return
  }
  const previousDay = () => {
    if (day > 1) {
      const previousDay = parseInt(day) - 1;
      router.push(`/programs/pillars?program=${program}&week=${week}&day=${previousDay}`);

    } else return
  }

  // useEffect(() => {
  //   console.log(workout)
  // }, []);

 
  return (
    <>
      <div className="flex justify-center items-center gap-8 py-4 bg-black">
        <button onClick={previousProgram} className='workout-button'>&lt;</button>
        <p className="uppercase text-white text-xl">{PROGRAM_LIST[program]}</p>
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
