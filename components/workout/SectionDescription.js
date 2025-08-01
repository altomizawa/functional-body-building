import React from 'react'

const SectionDescription = ({ description }) => {
  return (
    <div className="w-[90%] mx-auto mt-4 space-y-2">
      <p className="whitespace-pre-line pt-2">{description}</p>
    </div>
  )
}

export default SectionDescription
