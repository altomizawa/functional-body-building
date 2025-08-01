import React from 'react'

const VideosContainer = ({children, numberOfVideos}) => {
  return (
    <div className="w-[90%] mx-auto mt-4 space-y-2">
      <h3>VIDEOS ({numberOfVideos}):</h3>
      <div className="w-full mx-auto mt-2 space-y-2 flex gap-4 items-center overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default VideosContainer
