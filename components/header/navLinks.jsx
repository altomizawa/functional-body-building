import React from 'react'
import { User, Dumbbell, History, LogOut, LayoutDashboard } from 'lucide-react'

const NavLink = ({ children, handleClick, type }) => {
  const linkConfig = {
    dashboard: {
      icon: LayoutDashboard,
      className: 'text-white text-xl uppercase py-4 duration-500 hover:bg-gray-300 hover:text-black px-4 cursor-pointer flex gap-4 items-center'
    },
    profile: {
      icon: User,
      className: 'text-white text-xl uppercase py-4 duration-500 hover:bg-gray-300 hover:text-black px-4 cursor-pointer flex gap-4 items-center'
    },
    workouts: {
      icon: Dumbbell,
      className: 'text-white text-xl uppercase py-4 duration-500 hover:bg-gray-300 hover:text-black px-4 cursor-pointer flex gap-4 items-center'
    },
    previous: {
      icon: History,
      className: 'text-white text-xl uppercase py-4 duration-500 hover:bg-gray-300 hover:text-black px-4 cursor-pointer flex gap-4 items-center'
    },
    logout: {
      icon: LogOut,
      className: 'text-white text-xl uppercase py-4 duration-500 hover:bg-red-600 hover:text-white px-4 cursor-pointer flex gap-4 items-center' // Estilo diferente para logout
    }
  }
  
  const config = linkConfig[type]
  if (!config) return null
  
  const { icon: IconComponent, className } = config
  
  return (
    <li onClick={handleClick} className={className}>
      <IconComponent />
      {children}
    </li>
  )
}

export default NavLink