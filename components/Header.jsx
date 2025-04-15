'use client'
import { useState, useEffect } from 'react'
import { logout } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const Header = ({ session }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  
  const handleLogout = async () => {
    await logout()
    setCurrentUser(null)
    setIsOpen(false)
  }

  const goToPreviousWorkouts = () => {
    setIsOpen(false)
    redirect('/programs/completed')
  }

  useEffect(() => {
    setCurrentUser(session?.user)
  }, [session])

  if (!session) {
    return null
  } else return (
    <div className='fixed top-0 right-0 h-[320px] z-10'>
      <button className='absolute top-6 right-6 flex flex-col gap-2  border-black w-8 aspect-square' onClick={() => setIsOpen(!isOpen)}>
        <div className={`${isOpen ? "absolute top-4 left-0 rotate-45 w-full h-[2px] bg-gray-400 duration-300" : "h-[2px] bg-gray-400 duration-300"}`}></div>
        <div className={`${isOpen ? "hidden" : "w-full h-[2px] bg-gray-400"}`}></div>
        <div className={`${isOpen ? "absolute top-4 left-0 -rotate-45 w-full h-[2px] bg-gray-400 duration-300" :"h-[2px] bg-gray-400 duration-300" }`}></div>
      </button>
      {isOpen && 
        <div className='bg-white w-screen md:w-full h-screen p-8 pt-24'>
          <h2>HI, {currentUser?.name}</h2>
          <ul className='mt-8 flex flex-col gap-4'>
            <li className='cursor-pointer hover:underline'>Profile</li>
            <li onClick={goToPreviousWorkouts} className='cursor-pointer hover:underline'>Previous Workouts</li>
            <li className='cursor-pointer hover:underline' onClick={handleLogout} >Logout</li>
          </ul>
        </div>
      }
    </div>
  )
}

export default Header
