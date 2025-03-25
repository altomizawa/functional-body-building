import React from 'react'

const Preview = ({workout}) => {
  return (
    <>
      <div className="mt-4 mb-12">
        <div className='w-full bg-black text-white p-4'>
          <h2 className='text-2xl uppercase font-bold'>{workout.program}</h2>
          <div className='flex items-center gap-4'>
            <h2 className='text-2xl'>{workout.date}</h2>
            <div className='flex gap-4 text-white'>
              <h2>WEEK: {workout.week}</h2>
              <h2>DAY: {workout.day}</h2>
            </div>

          </div>
        </div>
        {workout.sections?.map((workout, index) => (
          <div key={index}>
            <div className='w-full bg-black px-4 py-2 mt-8'>
              <h3 className='text-white font-bold text-base flex items-center uppercase'>{workout.section}</h3>
            </div>
            <p className='whitespace-pre-line mt-4 px-4'>{workout.description}</p>
            <p className='mt-4 px-4'><strong>NOTES:</strong> {workout.notes}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Preview
