'use client'
import ProgramSelection from '@/components/ProgramSelection'
import DateSelector from '@/components/DateSelector'
import Image from 'next/image'
import ideaIcon from '@/public/icons/idea.svg'
import { useEffect, useState } from 'react'
import connectDB from '@/lib/database/db'
import { YouTubeEmbed } from "@next/third-parties/google";


const Page = () => {
  const [workout, setWorkout] = useState({})
  const [week, setWeek] = useState(1)
  const [day, setDay] = useState(1)
  const [movements, setMovements] = useState([])


  useEffect(() => {
    async function fetchData() {
      await connectDB()
      try{
        // FETCH WORKOUTS FROM API
        const resWorkout = await fetch('/api/programs/pillars',
          {method: 'POST',
           headers: {
            'Content-Type': 'application/json'
           },
           body: JSON.stringify({
            program: 'Cycle 2',
            week: week,
            day: day,
           }),
          }
        )
        if (!resWorkout.ok){
          console.error('No workouts found')
          return
        }
        const data = await resWorkout.json()
        setWorkout(data)
        
        // FETCH MOVEMENTS FROM API
        const resMovements = await fetch('/api/movements',
          {method: 'GET',
           headers: {
            'Content-Type': 'application/json'
           },
          }
        )
        if (resMovements.ok){
          const movements = await resMovements.json()
          setMovements(movements)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData();
  }, [week, day])

  function createVideoArray(sectionDescription) {
    return movements.filter(movement => 
      sectionDescription.toLowerCase().includes(movement.name.toLowerCase())
    );
  }

  function getQueryValue (url) {
    const parts = url.split("=");
    return parts.length > 1 ? parts[1] : null;
  }
  
  function changeDay(type) {
    if (type === 'increment' && day < 7) {
      setDay(prev => prev+1)
    } else if (type === 'increment' && day === 7) {
      setDay(1)
      setWeek(prev => prev+1)
    } else if(type ==='decrement' && week === 1 && day === 1){
      return
    } else if(type === 'decrement' && day === 1) {
      setDay(7)
      setWeek(prev => prev-1)
    } else {
      setDay(prev => prev-1)
    }
  }
  function changeWeek(type) {
    if (type === 'increment') {
      setWeek(prev => prev+1)
      setDay(1)
    } else if (type === 'decrement' && week === 1) {
      return
    } else{
      setWeek(prev => prev-1)
      setDay(1)
    }
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
        <div>
          <h1 className='text-center font-bold'>WEEK</h1>
          <div className='flex items-center gap-4 border-2'>
            <button onClick={() => changeWeek('decrement')} className='workout-button'>&lt;</button>
            <p>{week}</p>
            <button onClick={() => changeWeek('increment')} className='workout-button'>&gt;</button>
          </div>
        </div>
        <div>
          <h1 className='text-center font-bold'>DAY</h1>
          <div className='flex items-center gap-4 border-2'>
            <button onClick={() => changeDay('decrement')} className='workout-button'>&lt;</button>
            <p>{day}</p>
            <button onClick={() => changeDay('increment')} className='workout-button'>&gt;</button>
          </div>
        </div>
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
                <h3>VIDEOS ({createVideoArray(workout.description).length}):</h3>
                <div className='w-full mx-auto mt-2 space-y-2 flex gap-4 items-center overflow-auto'>
                  {createVideoArray(workout.description).map((video, index) => (
                    <div key={index} className='flex flex-col'>
                      <p className='text-xs font-bold'>{video.name.toUpperCase()}</p>
                      <YouTubeEmbed videoid={getQueryValue(video.link)}  width={400} />
                    </div>
                  ))}
                </div>
              </div>}
              {workout.notes && <div className='w-[90%] mx-auto mt-4'>
                <h3>NOTES:</h3>
                <p className='whitespace-pre-line text-sm'>{workout.notes}</p>
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
