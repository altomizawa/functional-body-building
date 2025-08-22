import React from 'react'

const Dropdown = ({ array, action }) => {
  return (
     <ul className='absolute top-0 left-0 z-10 w-full bg-neutral-500 border-[1px] border-black/20 shadow-md max-h-60 overflow-y-auto'>
      {array.map((movement, movIdx) => (
        <React.Fragment key={movIdx}>
          <li
            className='px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white'
            onClick={() => action(movement)}
            >
            {movement.name}
          </li>
          <div className='h-[1px] bg-neutral-600' />
        </React.Fragment>
      ))}
    </ul>
  )
}

export default Dropdown
