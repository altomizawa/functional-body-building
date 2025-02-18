import React from 'react'
import Image from 'next/image'
import ideaIcon from '@/public/icons/idea.svg'
import Link from 'next/link'



const EditTrainingSection = ({dailyWorkout}) => {
  if (!dailyWorkout || !Array.isArray(dailyWorkout)) {
    return <div>loading...</div>
  }
  return (
    <>
      {dailyWorkout.map((workout, index) => (
        <div key={index}>
          <div className='w-full bg-black px-4 py-2 mt-8'>
          <input placeholder={workout.section} className='text-white bg-black w-full font-bold text-base flex items-center uppercase' />
          </div>
          {workout.exercises.map((exercise, index) => (
            <div key={index}>
              <div key={index} className='w-[90%] mx-auto mt-2 space-y-2 flex items-center justify-between flex-col'>
                <div className='w-full min-h-[400px] flex'>
                  {exercise.name && <textarea className='text-black bg-gray-200 w-full' placeholder={exercise.name}/>}
                  <textarea className='description w-full h-full' placeholder={exercise.description} />
                </div>
                <p>video: </p>
                {exercise.video && <Link href={exercise.video} target='_blank' className='font-bold text-sm border-2 px-2 text-gray-600 rounded-full'>video</Link>}
              </div>
            </div>
          ))}
          {workout.notes && <div className='w-[90%] mx-auto mt-2 space-y-2'>
            <h3>NOTES:</h3>
            <p>{workout.notes}</p>
          </div>}
        </div>
      ))}
    </>
  )
}

export default EditTrainingSection
