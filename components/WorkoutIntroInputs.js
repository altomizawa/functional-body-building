import React from 'react'

const WorkoutIntroInputs = ({ handleChange }) => {
  return (
    <>
      <label htmlFor="date">Workout Date</label>
        <input type="date" name="date" required onChange={handleChange}/>
        <label htmlFor="program">Program Type</label>
        <input type="string" name="program" required onChange={handleChange} />
        <div className='overflow-hidden grid grid-cols-2 gap-2'>
          <div>
            <label htmlFor="week">Week</label>
            <input type="number" name="week" required onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="day">Day</label>
            <input type="number" name="day" required onChange={handleChange} />
          </div>
        </div>
    </>
  )
}

export default WorkoutIntroInputs
