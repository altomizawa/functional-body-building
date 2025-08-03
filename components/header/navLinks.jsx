import React from 'react'
import { User, Dumbbell, History, LogOut } from 'lucide-react'

const NavLink = ({children, handleClick, type}) => {
  const liClass = 'text-white text-xl uppercase py-4 duration-500 hover:bg-gray-300 hover:text-black px-4 cursor-pointer flex gap-4 items-center';
  
  switch (type) {
    case 'profile':
      return (
        <li onClick={handleClick} className={liClass}>
          <User />{children}
        </li>
      )
    case 'workouts':
      return (
        <li onClick={handleClick} className={liClass}>
          <Dumbbell />{children}
        </li>
      )
      case 'previous':
        return (
          <li onClick={handleClick} className={liClass}>
            <History />{children}
          </li>
        )
    case 'logout':
      return (
        <li onClick={handleClick} className={liClass}>
          <LogOut />{children}
        </li>
      )
    }

}

export default NavLink
