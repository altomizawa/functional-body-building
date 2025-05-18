'use client'
import Link from 'next/link'
import Image from 'next/image'
import WorkoutNavigation from '@/components/WorkoutNavigation'
import MarkCompleteWorkoutButton from '@/components/MarkCompleteWorkoutButton';
import { CircleCheckBig } from 'lucide-react';
import { getQueryValue, createVideoArray } from '@/utils/utils';
import ideaIcon from '@/public/icons/idea.svg';
import { YouTubeEmbed } from "@next/third-parties/google";
import { useState, useEffect, use } from 'react';


const WorkoutPage = ({session, workout, movements, program, week, day, isWorkoutCompleted}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    workout && setIsLoading(false)
  },[workout])
  return (
    <>
      {/* Header */}
      <div className="bg-[rgba(0,0,0,0.3)] px-4 py-8 relative overflow-hidden">
        {session.user?.role === 'admin' && (
          <Link href="/programs" className='w-max text-center text-white px-4 py-2 rounded-md duration-300 hover:text-gray-400 flex items-center gap-2 justify-center'>
            <span className="material-symbols-outlined">arrow_back</span>BACK
          </Link>
        )}
        <Image 
          src="/images/Vitinho.jpg" 
          alt="background" 
          width={200} 
          height={200} 
          className="absolute top-[-25%] -z-10 left-0 w-full h-auto" 
        />

      </div>

      <WorkoutNavigation program={program} week={week} day={day} setIsLoading={setIsLoading} />

      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Completion Form */}
      {isWorkoutCompleted && !isLoading && <div className='bg-green-500 w-full py-6 flex justify-center items-center gap-2'>
        <CircleCheckBig color='white' />
        <p className= 'text-white text-center font-bold'>WORKOUT DONE</p>
      </div>}

      {/* Workout Content */}

      {workout && !isLoading && (
        <div className="-mt-8 mb-12">
          {workout.sections?.map((section, index) => (
            <div key={index}>
              <div className="w-full bg-black px-4 py-2 mt-8">
                <h3 className="text-white font-bold text-base flex items-center uppercase">
                  <Image src={ideaIcon} alt="icon" width={24} height={24} className="mr-2 w-6 h-6" />
                  {section.section}
                </h3>
              </div>

              <div className="w-[90%] mx-auto mt-4 space-y-2">
                <p className="whitespace-pre-line pt-2">{section.description}</p>
              </div>

              {/* Videos */}
              {movements && createVideoArray(movements, section.description).length > 0 && (
                <div className="w-[90%] mx-auto mt-4 space-y-2">
                  <h3>VIDEOS ({createVideoArray(movements, section.description).length}):</h3>
                  <div className="w-full mx-auto mt-2 space-y-2 flex gap-4 items-center overflow-auto">
                    {createVideoArray(movements, section.description).map((video, idx) => (
                      <div key={idx} className="flex flex-col">
                        <p className="text-xs font-bold">{video.name.toUpperCase()}</p>
                        <YouTubeEmbed videoid={getQueryValue(video.link)} width={400} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {section.notes && (
                <div className="w-[90%] mx-auto mt-4">
                  <h3>NOTES:</h3>
                  <p className="whitespace-pre-line text-sm">{section.notes}</p>
                </div>
              )}
            </div>
          ))}
          {!isWorkoutCompleted && <MarkCompleteWorkoutButton workoutId={workout._id.toString()} user={session.user} />}
        </div>
      )} 
      {!workout && !isLoading && (
        <div className="flex justify-center items-center h-[80vh]">
          <h1 className="font-bold text-2xl text-black uppercase">No workout found</h1>
        </div>
      )}     
    </>
  )
}

export default WorkoutPage
