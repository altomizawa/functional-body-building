'use client'
import ProgramSelection from '@/components/ProgramSelection'
import TrainingSection from '@/components/TrainingSection'
import DateSelector from '@/components/DateSelector'
import Image from 'next/image'
import ideaIcon from '@/public/icons/idea.svg'
import { useEffect, useState } from 'react'
import connectDB from '@/lib/database/db'
import { YouTubeEmbed } from "@next/third-parties/google";
import { getQueryValue } from '@/utils/utils'


const TwelveWeeks = () => {
  const [workout, setWorkout] = useState({})
  const [dailyWorkout, setDailyWorkout] = useState({
    program: 'Pillars',
    week: 1,
    day: 1,
  })
  const [movements, setMovements] = useState([])

  // FETCH WORKOUTES FROM API
  const fetchWorkouts = () => {
    fetch('/api/programs/pillars/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        program: dailyWorkout.program,
        week: dailyWorkout.week,
        day: dailyWorkout.day,
      }),
      }
    )
    .then(response => response.json())
    .then(data => {
      setWorkout(data)
    })
    .catch(err => console.error(err))
  }

  // FETCH MOVEMENTS FROM API
  const fetchMovements = () => {
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

  useEffect(() => {
    async function fetchData() {
      await connectDB();
      fetchWorkouts();
      fetchMovements();
    }
    fetchData();

  }, [dailyWorkout])

  function createVideoArray(sectionDescription) {
    console.log(movements)
    // const matches = movements.filter(movement => 
    //   sectionDescription.toLowerCase().includes(movement.name.toLowerCase())
    // );
    // console.log(matches)
    return movements.filter(movement => 
      sectionDescription.toLowerCase().includes(movement.name.toLowerCase())
    );
  }

  const programList = ["Pillars", "Cycle 2", "Bridge Week 1", "Cycle 3", "Cycle 4", "Bridge Week 2"]

  const changeWeek = ({type}) => {
    if (type === 'add') {
      if(dailyWorkout.week === 12) return
      setDailyWorkout(prev => {
        return {
          ...prev,
          week: prev.week + 1
        }
      })
    } else if (type === 'subtract') {
      if(dailyWorkout.week === 1) return
      setDailyWorkout(prev => {
        return {
          ...prev,
          week: prev.week - 1
        }
      })
    }
  }
  
  const changeDay = ({type}) => {
    if (type === 'add') {
      console.log('add')
      if(dailyWorkout.day === 7) {
        changeWeek({type: 'add'})
        setDailyWorkout(prev => {
          return {
            ...prev,
            day: 1,
          }
        })
        return
      }
      setDailyWorkout(prev => {
        return {
          ...prev,
          day: prev.day + 1
        }
      })
    } else if (type === 'subtract') {
      if(dailyWorkout.day === 1) {
        changeWeek({type: 'subtract'})
        setDailyWorkout(prev => {
          return {
            ...prev,
            day: 7,
          }
        })
        return
      }
      setDailyWorkout(prev => {
        return {
          ...prev,
          day: prev.day - 1,
        }
      })
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
      <div className="flex mt-4 gap-4 border-2 p-12">
        <div className='bg-orange-500 rounded-lg p-4'>
          <h3 className='text-white text-center uppercase text-4xl'>{dailyWorkout.program}</h3>
          <div className='flex  gap-4 border-t-2'>
            {programList.map((program, index) => (
              <button onClick={() => setDailyWorkout( prev => {
                return {
                  ...prev,
                  program: program,
                  week: 1,
                  day: 1,
                }
              }) } key={index} className={`text-md text-white uppercase`}>{program}</button>
            ))}
          </div>
        </div>
        <div className=' bg-orange-500 rounded-lg'>
          <h3 className='text-white font-bold text-center text-3xl border-b-2 border-white'>WEEK</h3>
            <div className='flex items-center gap-2 justify-between bg-orange-500 px-4 py-2 rounded-md'>
              <button onClick={() => {changeWeek({type: 'subtract'})}} className='text-white text-3xl font-bold'>-</button>
              <h2 className='w-24 text-center font-bold text-4xl text-white'>{dailyWorkout.week}</h2>
              <button onClick={() => {changeWeek({type: 'add'})}} className='text-white text-3xl font-bold '>+</button>
            </div>
        </div>
        <div className=' bg-orange-500 rounded-lg'>
          <h3 className='text-white font-bold text-center text-3xl border-b-2 border-white'>DAY</h3>
            <div className='flex items-center gap-2 justify-between bg-orange-500 px-4 py-2 rounded-md'>
              <button onClick={() => {changeDay({type: 'subtract'})}} className='text-white text-3xl font-bold'>-</button>
              <h2 className='w-24 text-center font-bold text-4xl text-white'>{dailyWorkout.day}</h2>
              <button onClick={() => {changeDay({type: 'add'})}} className='text-white text-3xl font-bold '>+</button>
            </div>
        </div>
        {/* <ProgramSelection /> */}
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

export default TwelveWeeks
