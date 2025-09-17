import React from 'react'

const WorkoutFormSection = ({ children, currentSection, index, ...props }) => {
  return (
    <div className={`space-y-8 border-[1px] border-neutral-600 p-6 ${currentSection === index ? 'block' : 'hidden'}`} {...props}>
      {children}
    </div>
  )
}

export default WorkoutFormSection
