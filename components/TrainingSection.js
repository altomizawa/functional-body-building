import React from 'react'
import Image from 'next/image'
import ideaIcon from '@/public/icons/idea.svg'
import Link from 'next/link'



const TrainingSection = ({dailyWorkout}) => {
  if (!dailyWorkout || !Array.isArray(dailyWorkout)) {
    return <div>loading...</div>
  }
  return (
    <>
      {dailyWorkout.map((workout, index) => (
        <div key={index}>
          <div className='w-full bg-black px-4 py-2 mt-8'>
          <h3 className='text-white font-bold text-base flex items-center uppercase'><Image src={ideaIcon} alt="icon" width={24} height={24} className='mr-2 upp'/>{workout.section}</h3>
          </div>
          {workout.exercises.map((exercise, index) => (
            <div key={index}>
              <div key={index} className='w-[90%] mx-auto mt-2 space-y-2 flex items-center justify-between'>
                <div className=''>
                  <h3>{exercise.name}</h3>
                  <p className='description'>{exercise.description}</p>
                </div>
                {exercise.video && <Link href={exercise.video} target='_blank' className='font-bold text-sm border-2 px-2 text-gray-600 rounded-full'>video</Link>}
              </div>
            </div>
          ))}
          {workout.notes && <div className='w-[90%] mx-auto mt-2 space-y-2'>
            <h3>NOTES:</h3>
            <p className='whitespace-pre-line'>{workout.notes}</p>
          </div>}
        </div>
      ))}
    </>
  )
}

export default TrainingSection
