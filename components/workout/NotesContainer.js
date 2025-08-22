import React from 'react'

const NotesContainer = ({ notes }) => {
  return (
    <div className="w-[90%] mx-auto mt-4">
      <h3>NOTES:</h3>
      <p className="whitespace-pre-line text-base">{notes}</p>
    </div>
  )
}

export default NotesContainer
