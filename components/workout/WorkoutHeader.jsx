import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

const WorkoutHeader = ({ session, workout }) => {
  return (
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
        
        {workout && (
          <>
            <h1 className="font-bold text-2xl text-white uppercase text-center">{workout.program}</h1>
            <h2 className="font-bold text-lg text-white uppercase text-center">
              Week {workout.week} | day {workout.day}
            </h2>
          </>
        )}
      </div>
  )
}

export default WorkoutHeader
