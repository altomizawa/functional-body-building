import React from 'react'

const Preview = ({ sections, exercises }) => {
  return (
    <div>
      {
          sections.map((section, index) => (
            <div key={index} className='flex flex-col gap-2 border-b-2 py-4 border-gray-800'>
              <h3>Section:</h3>
              <h3 className='uppercase'>{section.section}</h3>
              {/* <h3>exercises:</h3> */}
              {
                exercises.map((exercise, index) => (
                  <div key={index} className='flex flex-col gap-2'>
                    <p>{exercise.name}</p>
                    <p>{exercise.description}</p>
                    <p>{exercise.video}</p>
                  </div>
                ))
              }
              {/* <h3>notes:</h3> */}
              <p>{section.notes}</p>
            </div >
          ))
        }
    </div>
  )
}

export default Preview
