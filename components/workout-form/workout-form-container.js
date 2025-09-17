import React from 'react'


const WorkoutFormContainer = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className='h-full px-6 my-16 max-w-[1440px] mx-auto'>
      {children}
    </form>
  )
}

export default WorkoutFormContainer 
