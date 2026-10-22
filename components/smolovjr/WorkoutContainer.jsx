'use client'
import WorkoutCard from "./WorkoutCard";
import { useState } from "react";

export default function WorkoutContainer({ data }) {
  const [currentDay, setCurrentDay] = useState(null);


  return (
    <ul className='flex flex-wrap gap-8 justify-center max-w-[1300px]'>
      {data.map(day => (
        <WorkoutCard key={day.id} day={day} currentDay={currentDay} setCurrentDay={setCurrentDay} />
      ))}
    </ul>
  )
}