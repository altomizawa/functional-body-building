'use client'
import WorkoutCard from "./WorkoutCard";
import { useState } from "react";

export default function WorkoutContainer({ data }) {
  const [currentDay, setCurrentDay] = useState(null);
  const [movement, setMovement] = useState('back-squat')
  const isBackSquat = movement === 'back-squat'
  const isBenchPress = movement === 'bench-press'
  return (
    <main className='flex flex-col gap-12 items-center justify-center'>
      <h1 className='text-[3rem] font-bold text-center sm:text-left'>SMOLOV JR</h1>
      <div className='flex gap-8'>
        <button onClick={() => setMovement('back-squat')} className={`text-[2rem] font-bold text-center sm:text-left ${isBackSquat ? 'underline' : ''}`}>BACK SQUAT</button>
        <button onClick={() => setMovement('bench-press')} className={`text-[2rem] font-bold text-center sm:text-left ${isBenchPress ? 'underline' : ''}`}>BENCH PRESS</button>
      </div>
      <div className='flex justify-between items-center w-full'>
        <div className='text-center border-b border-white w-full flex justify-center gap-8'>
          <h2 className='text-xl pb-2'>PREVIOUS 1RM: 250 </h2>
          <h2 className='text-xl pb-2'>1RM: 250 </h2>
        </div>
      </div>
      <ul className='flex flex-wrap gap-8 justify-center max-w-[1300px]'>
        {data.map(day => (
          <WorkoutCard key={day.id} day={day} currentDay={currentDay} setCurrentDay={setCurrentDay} />
        ))}
      </ul>
    </main>
  )
}