'use client'

import { useState } from 'react'

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

  const programList = ['Pump Lift', 'Pump Condition', 'Perform', 'Pillars', 'Minimalist']


  return (
    <div className='relative z-0'>
      <div className='flex justify-center items-center'>
        <button 
          className='uppercase font-bold text-sm underline underline-offset-4'
          onClick={toggle}
        >{currentProgram}</button>
      </div>
      <ul className={`w-screen translate-x-[-50%] bg-white pl-4 ${!isOpen && "hidden"}`}>
        {programList.map((program, index) => (
          <li key={index} className={`programListItems ${currentProgram === program && "font-bold"}`} onClick={() => changeProgram(program)}><span className={`font-bold ${currentProgram !== program && 'hidden'}`}>&gt; </span>{program}</li>
        ))}
      </ul>
      <div className={`w-screen h-screen bg-black opacity-40 fixed top-0 left-0 -z-10 ${!isOpen && "hidden"}`}></div>
    </div>
  )
}

export default ProgramSelection
