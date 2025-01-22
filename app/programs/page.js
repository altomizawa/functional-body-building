'use client'
import ProgramSelection from '@/components/ProgramSelection'
import TrainingSection from '@/components/TrainingSection'
import DateSelector from '@/components/DateSelector'
import Image from 'next/image'
import ideaIcon from '@/public/icons/idea.svg'
import { getCurrentWorkout } from '@/lib/actions'
import { useEffect, useState } from 'react'
import connectDB from '@/lib/database/db'
 



const Page = () => {
  const API_TOKEN = process.env.DBACCESSTOKEN

  console.log(API_TOKEN, API_ACCESS_POINT)

  const [workout, setWorkout] = useState({})
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    async function fetchData() {
      fetch('/api/programs/pillars',
        {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + API_TOKEN
        },
        
         body: JSON.stringify(date.toISOString().split('T')[0]),
        }
      )
      .then(response => response.json())
      .then(data => {setWorkout(data)})
      .catch(err => console.error(err))
    }
    fetchData();
  }, [date])
  
  return (
    <>

      {/* PROFILE DETAILS */}
      <div className="flex gap-3 items-center">
        <div className='rounded-full overflow-hidden border-2 aspect-square w-[100px]'>
          <Image src="https://media.istockphoto.com/id/1371301832/photo/excited-young-man-wearing-denim-shirt.jpg?s=612x612&w=0&k=20&c=AtgXnYVh2GpkMGlLwjIYDAwQ6fFvr0ii591bsEaJyLk=" alt="profile picture" width={200} height={200} />
        </div>
        <h3 className='font-bold text-lg'>@altomizawa</h3>
      </div>
      
      <div className="bg-black p-4">
        <h1 className="font-bold text-2xl text-white uppercase">{workout.program}</h1>
        <h2 className="font-bold text-lg text-white uppercase">Week {workout.week} | day {workout.day}</h2>
      </div>

      {/* DATE AND PROGRAM SELECTION */}
      <div className="flex mt-4">
        <DateSelector date={date} setDate={setDate} />
        <ProgramSelection />
      </div>

      {/* WORKOUT */}
      <div className="mt-4 mb-12">
       <TrainingSection dailyWorkout={workout.workout} />
      </div>
    </>
  )
}

export default Page
