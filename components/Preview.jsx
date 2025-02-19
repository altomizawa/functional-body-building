import React from 'react'

const Preview = ({workout}) => {
  console.log(workout)
  return (
    <div>
      <h1>hello</h1>
      <div className="mt-4 mb-12">
        {workout.sections?.map((workout, index) => (
          <div key={index}>
            <div className='w-full bg-black px-4 py-2 mt-8'>
            <h3 className='text-white font-bold text-base flex items-center uppercase'>{workout.section}</h3>
              {/* <h1>{workout.section}</h1> */}
            </div>

            <div className='w-[90%] mx-auto mt-4 space-y-2'>
              <p className='whitespace-pre-line'>{workout.description}</p>
            </div>

            {workout.videoDemo.length > 0 && <div className='w-[90%] mx-auto mt-4 space-y-2'>
              <h3>VIDEOS:</h3>
              <div className='w-[90%] mx-auto mt-2 space-y-2 flex gap-2 items-center justify-center border-2 overflow-auto'>
                {workout.videoDemo.map((video, index) => (
                  <iframe key={index} width="560" height="315" src="https://www.youtube.com/embed/fJigBduO3d8?si=y2AJhNMkDFc5dkn6" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen='true'></iframe>
                ))}
              </div>
            </div>}
          </div>
        ))}
      </div>

    </div>
    
    // <div>
    //    {
    //       workout !== null ? 
    //       (<>
    //         <div className="mt-4 mb-12">
    //         {workout.sections?.map((workout, index) => (
    //           <div key={index}>
    //             <div className='w-full bg-black px-4 py-2 mt-8'>
    //             <h3 className='text-white font-bold text-base flex items-center uppercase'><Image src={ideaIcon} alt="icon" width={24} height={24} className='mr-2 upp'/>{workout.section}</h3>
    //               {/* <h1>{workout.section}</h1> */}
    //             </div>

    //             <div className='w-[90%] mx-auto mt-4 space-y-2'>
    //               <p className='whitespace-pre-line'>{workout.description}</p>
    //             </div>

    //             {workout.videoDemo.length > 0 && <div className='w-[90%] mx-auto mt-4 space-y-2'>
    //               <h3>VIDEOS:</h3>
    //               <div className='w-[90%] mx-auto mt-2 space-y-2 flex gap-2 items-center justify-center border-2 overflow-auto'>
    //                 {workout.videoDemo.map((video, index) => (
    //                   <iframe key={index} width="560" height="315" src="https://www.youtube.com/embed/fJigBduO3d8?si=y2AJhNMkDFc5dkn6" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen='true'></iframe>
    //                 ))}
    //               </div>
    //             </div>}
    //           </div>
              
    //         ))}


    //         </div>
    //       </>) : (
    //         <div className='flex justify-center items-center h-[80vh]'>
    //             <h1 className="font-bold text-2xl text-black uppercase">No workout found</h1>

    //         </div>
    //       )
    //     }
    // </div>
  )
}

export default Preview
