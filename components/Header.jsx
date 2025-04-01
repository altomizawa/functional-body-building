'use client'
import { useState, useEffect } from 'react'
import { logout } from '@/lib/actions'


const Header = ({ session }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  
  const handleLogout = async () => {
    await logout()
    setCurrentUser(null)
    setIsOpen(false)
  }

  useEffect(() => {
    setCurrentUser(session?.user)
  }, [currentUser])

  if (!session) {
    return null
  } else return (
    <div className='aspect-square fixed top-0 right-0 w-min h-[320px] z-10'>
      <button className='absolute top-4 right-4 flex flex-col gap-2  border-black w-10 aspect-square' onClick={() => setIsOpen(!isOpen)}>
        <div className={`${isOpen ? "absolute top-4 left-0 rotate-45 w-full h-1 bg-gray-800" : "w-10 h-1 bg-gray-600"}`}></div>
        <div className={`${isOpen ? "hidden" : "w-full h-1 bg-gray-600"}`}></div>
        <div className={`${isOpen ? "absolute top-4 left-0 -rotate-45 w-full h-1 bg-gray-800" :"w-10 h-1 bg-gray-600" }`}></div>
      </button>
      {isOpen && 
        <div className='bg-white w-screen md:w-full h-screen p-8 pt-24'>
          <h2>HI, {currentUser?.name}</h2>
          <ul className='mt-8 flex flex-col gap-4'>
            <li className='cursor-pointer hover:underline'>Profile</li>
            <li className='cursor-pointer hover:underline pointer-events-none text-gray-400'>Previous Workouts</li>
            <li className='cursor-pointer hover:underline' onClick={handleLogout} >Logout</li>
          </ul>
        </div>
      }
    </div>
  )
}

export default Header
