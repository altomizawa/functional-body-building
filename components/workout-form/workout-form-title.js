import React from 'react'

const WorkoutFormTitle = ({ children, variant='default', className, ...props }) => {

  const variants = {
    default: 'text-2xl md:text-3xl font-bold text-left',
    small: 'text-xl md:text-2xl font-bold text-left',
    medium: 'text-2xl md:text-3xl font-bold text-left',
    large: 'text-3xl md:text-4xl font-bold text-left',
  }
  return (
    <h1 className={`${variants[variant]} ${className}`} {...props}>{children}</h1>
  )
}

export default WorkoutFormTitle
