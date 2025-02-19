'use client'
import ProgramSelection from '@/components/ProgramSelection'
import TrainingSection from '@/components/TrainingSection'
import DateSelector from '@/components/DateSelector'
import Image from 'next/image'
import ideaIcon from '@/public/icons/idea.svg'
import { getCurrentWorkout } from '@/lib/actions'
import { useEffect, useState } from 'react'
import connectDB from '@/lib/database/db'
import { YouTubeEmbed } from "@next/third-parties/google";
import { get } from 'mongoose'


const Page = () => {
  const [workout, setWorkout] = useState({})
  const [date, setDate] = useState(new Date())
  const [movements, setMovements] = useState([])

  async function getWorkout(date) {
    const response = await getCurrentWorkout(date)
    const data = await response.json()
    console.log(data)
  }

  useEffect(() => {
    async function fetchData() {
      await connectDB()

      // FETCH WORKOUTES FROM API
      fetch('/api/workouts',
        {method: 'POST',
         headers: {
          'Content-Type': 'application/json'
         },
         body: JSON.stringify({
          date: date.toISOString().split('T')[0]
         }),
        }
      )
      .then(response => response.json())
      .then(data => {
        setWorkout(data)
      })
      .catch(err => console.error(err))
      
      // FETCH MOVEMENTS FROM API
      fetch('/api/movements',
        {method: 'GET',
         headers: {
          'Content-Type': 'application/json'
         },
        }
      )
      .then(response => response.json())
      .then(data => {
        setMovements(data)
      })
      .catch(err => console.error(err))
    }
    fetchData();
    // getWorkout(date)
  }, [date])

  function createVideoArray(sectionDescription) {
    return movements.filter(movement => 
      sectionDescription.toLowerCase().includes(movement.name.toLowerCase())
    );
  }

  function getQueryValue (url) {
    const parts = url.split("=");
    return parts.length > 1 ? parts[1] : null;
  }
  


  return (
    <>

      {/* PROFILE DETAILS */}
      <div className="flex gap-3 items-center">
        <div className='rounded-full overflow-hidden border-2 aspect-square w-[100px]'>
          <Image src="https://media.istockphoto.com/id/1371301832/photo/excited-young-man-wearing-denim-shirt.jpg?s=612x612&w=0&k=20&c=AtgXnYVh2GpkMGlLwjIYDAwQ6fFvr0ii591bsEaJyLk=" alt="profile picture" width={200} height={200} />
        </div>
        <h3 className='font-bold text-lg'>@altomizawa</h3>
      </div>
      <div className="bg-[rgba(0,0,0,0.3)] px-4 py-8 relative overflow-hidden">
        <Image src="/images/Vitinho.jpg" alt="idea icon" width={200} height={200} className='absolute top-[-25%] -z-10 left-0 w-full h-auto' />
        {
          workout !== null ? 
          <>
            <h1 className="font-bold text-2xl text-white uppercase">{workout.program}</h1>
            <h2 className="font-bold text-lg text-white uppercase">Week {workout.week} | day {workout.day}</h2> 
          </> : 
            <h1 className="font-bold text-2xl text-white uppercase">No workout found</h1>
          
        }
        
      </div>

      {/* DATE AND PROGRAM SELECTION */}
      <div className="flex mt-4">
        <DateSelector date={date} setDate={setDate} />
        <ProgramSelection />
      </div>

      {/* WORKOUT */}
      {
        workout !== null ? 
        (<>
          <div className="mt-4 mb-12">
          {workout.sections?.map((workout, index) => (
            <div key={index}>
              <div className='w-full bg-black px-4 py-2 mt-8'>
              <h3 className='text-white font-bold text-base flex items-center uppercase'><Image src={ideaIcon} alt="icon" width={24} height={24} className='mr-2 upp'/>{workout.section}</h3>
                {/* <h1>{workout.section}</h1> */}
              </div>

              <div className='w-[90%] mx-auto mt-4 space-y-2'>
                <p className='whitespace-pre-line'>{workout.description}</p>
              </div>

              {createVideoArray(workout.description).length > 0 && <div className='w-[90%] mx-auto mt-4 space-y-2'>
                <h3>VIDEOS:</h3>
                <div className='w-full mx-auto mt-2 space-y-2 flex gap-4 items-center overflow-auto'>
                  {createVideoArray(workout.description).map((video, index) => (
                    <div key={index} className='flex flex-col'>
                      <h3>{video.name.toUpperCase()}</h3>
                      <YouTubeEmbed videoid={getQueryValue(video.link)}  width={400} />
                    </div>
                  ))}
                </div>
              </div>}
            </div>
            
          ))}


          </div>
        </>) : (
          <div className='flex justify-center items-center h-[80vh]'>
              <h1 className="font-bold text-2xl text-black uppercase">No workout found</h1>

          </div>
        )
      }
      
    </>
  )
}

export default Page
