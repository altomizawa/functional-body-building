'use client'

import { useState } from 'react'
import { PROGRAMLIST } from '@/lib/utils'

const ProgramSelection = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentProgram, setCurrentProgram] = useState('Pillars')

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  const changeProgram = (program) => {
    setCurrentProgram(program)
    setIsOpen(false)
  }

  return (
    <div className='relative z-0 w-full items-center flex justify-center'>
      <div className=''>
        <button 
          className='uppercase font-bold text-sm underline underline-offset-4'
          onClick={toggle}
        >{currentProgram}</button>
      </div>
      <ul className={`w-screen translate-x-[-50%] bg-white pl-4 ${!isOpen && "hidden"}`}>
        {PROGRAMLIST.map((program, index) => (
          <li key={index} className={`programListItems ${program !== "Pillars" && "pointer-events-none"} ${currentProgram === program && "font-bold"} cursor-pointer`} onClick={() => changeProgram(program)}><span className={`font-bold ${currentProgram !== program && 'hidden'}`}>&gt; </span>{program}</li>
        ))}
      </ul>
      <div className={`w-screen h-screen bg-black opacity-40 fixed top-0 left-0 -z-10 ${!isOpen && "hidden"}`}></div>
    </div>
  )
}

export default ProgramSelection
