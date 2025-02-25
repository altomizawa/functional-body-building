
import ProgramSelection from '@/components/ProgramSelection'
import TrainingSection from '@/components/TrainingSection'
import DateSelector from '@/components/DateSelector'
import Image from 'next/image'
import ideaIcon from '@/public/icons/idea.svg'
import { getCurrentWorkout, getMovements,  getTwelveWeekWorkout } from '@/lib/actions'
import connectDB from '@/lib/database/db'
import { YouTubeEmbed } from "@next/third-parties/google";
import { get } from 'mongoose'


const TwelveWeek = async () => {
  // const response = await getCurrentWorkout('2025-01-08')
  let day=1
  const response = await getTwelveWeekWorkout({week: 1, day:day})

  const workout = await response.json()
  
  const movementsres = await getMovements()
  const movements = await movementsres.json()
  console.log(movements)


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
      {/* <div>
        <button onClick={() => {changeDay("add")}} className='p-2 border-2 bg-black text-white mr-8'>PREVIOUS DAY</button>
        <button onClick={() => {changeDay("remove")}} className='p-2 border-2 bg-black text-white mr-8'>NEXT DAY</button>
      </div> */}

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

export default TwelveWeek
