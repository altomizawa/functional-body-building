'use client'
import { useState, useEffect } from 'react'
import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NavLink from './navLinks'
import NavLinkContainer from './NavLinkContainer'

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    return null
  } else return (
    <div className='fixed top-0 right-0 h-[320px] z-10'>
      <MenuSandwich isOpen={isOpen} setIsOpen={setIsOpen} />
      <NavOpen isOpen={isOpen} setIsOpen={setIsOpen} username={user.name} />
    </div>
  )
}

const MenuSandwich = ({ isOpen, setIsOpen }) => {
  return (
     <button className='fixed top-6 right-6 flex flex-col gap-2  border-black w-8 aspect-square' onClick={() => setIsOpen(!isOpen)}>
      <div className={`${isOpen ? "absolute top-4 left-0 rotate-45 w-full h-[2px] bg-gray-400 duration-300" : "h-[2px] bg-gray-400 duration-300"}`}></div>
      <div className={`${isOpen ? "hidden" : "w-full h-[2px] bg-gray-400"}`}></div>
      <div className={`${isOpen ? "absolute top-4 left-0 -rotate-45 w-full h-[2px] bg-gray-400 duration-300" :"h-[2px] bg-gray-400 duration-300" }`}></div>
    </button>

  )
}

const NavOpen = ({ isOpen, setIsOpen, username = 'Undefined' }) => {
  const goToPreviousWorkouts = () => {
    setIsOpen(false)
    redirect('/programs/completed')
  }

  const goToWorkouts = () => {
    setIsOpen(false)
    redirect('/programs/pillars')
  }
  
  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }
  return (
    <div className={`${isOpen ? 'right-0' : '-right-full'} duration-500  -z-10 fixed top-0 w-screen h-screen p-8 pt-24 grid place-content-center bg-black`}>
      <h2 className='text-4xl text-white'>HI, {username}</h2>
      <NavLinkContainer>
        <NavLink handleClick={() => {}} type='profile'>Profile</NavLink>
        <NavLink handleClick={goToWorkouts} type='workouts'>Workouts</NavLink>
        <NavLink handleClick={goToPreviousWorkouts} type='previous' >Previous Workouts</NavLink>
        <NavLink handleClick={handleLogout} type='logout' >Logout</NavLink>
      </NavLinkContainer>
    </div>
  )
}

export default Header
