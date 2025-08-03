import React from 'react'
import { User, Dumbbell, History, LogOut } from 'lucide-react'

const NavLink = ({children, handleClick, type}) => {
  switch (type) {
    case 'profile':
      return (
        <li onClick={handleClick} className='text-white text-xl uppercase cursor-pointer hover:underline underline-offset-4 flex gap-4 items-center'>
          <User />{children}
        </li>
      )
    case 'workouts':
      return (
        <li onClick={handleClick} className='text-white text-xl uppercase cursor-pointer hover:underline underline-offset-4 flex gap-4 items-center'>
          <Dumbbell />{children}
        </li>
      )
      case 'previous':
        return (
          <li onClick={handleClick} className='text-white text-xl uppercase cursor-pointer hover:underline underline-offset-4 flex gap-4 items-center'>
            <History />{children}
          </li>
        )
    case 'logout':
      return (
        <li onClick={handleClick} className='text-white text-xl uppercase cursor-pointer hover:underline underline-offset-4 flex gap-4 items-center'>
          <LogOut />{children}
        </li>
      )
    }

}

export default NavLink
