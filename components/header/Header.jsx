'use client'
import { useState, useEffect } from 'react'
import { logout } from '@/lib/auth'
import NavLink from './navLinks'
import NavLinkContainer from './NavLinkContainer'
import { useRouter } from 'next/navigation'
import Divider from './Divider'

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    return null
  } else return (
    <div className='fixed top-0 right-0 h-[320px] z-10'>
      <MenuSandwich isOpen={isOpen} setIsOpen={setIsOpen} />
      <NavOpen isOpen={isOpen} setIsOpen={setIsOpen} username={user.name} userRole={user.role} userId={user.id} />
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

const NavOpen = ({ isOpen, setIsOpen, username = 'Undefined', userRole, userId }) => {
  const router = useRouter()

  const goToPreviousWorkouts = () => {
    setIsOpen(false)
    router.push('/programs/completed')
  }
  const goToDashboard = () => {
    setIsOpen(false)
    router.push('/')
  }
 
  const goToProfile = () => {
    setIsOpen(false)
    router.push('/user/' + userId)
  }

  const goToWorkouts = () => {
    setIsOpen(false)
    router.push('/programs/pillars')
  }
  
  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [setIsOpen])


  return (
    <div className={`${isOpen ? 'right-0' : '-right-full'} duration-500  -z-10 fixed top-0 w-screen h-screen p-8 pt-24 grid place-content-center bg-black`}>
      <h2 className='text-4xl text-white'>HI, {username}</h2>
      <NavLinkContainer>
        {userRole === 'admin' && <>
          <NavLink handleClick={goToDashboard} type='dashboard'>Dashboard</NavLink>
          <Divider />
        </>}
        <NavLink handleClick={goToProfile} type='profile'>Profile</NavLink>
        <Divider />
        <NavLink handleClick={goToWorkouts} type='workouts'>Workouts</NavLink>
        <Divider />
        <NavLink handleClick={goToPreviousWorkouts} type='previous' >Previous Workouts</NavLink>
        <Divider />
        <NavLink handleClick={handleLogout} type='logout' >Logout</NavLink>
      </NavLinkContainer>
    </div>
  )
}

export default Header
