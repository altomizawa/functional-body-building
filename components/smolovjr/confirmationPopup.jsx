'use client'

export default function ConfirmationPopup({ onConfirm, onCancel, isCompleted }) {
  const handleConfirm = (e) => {
    e.stopPropagation()
    console.log(' confirm')
    onConfirm()
  }
  const handleCancel = (e) => {
    e.stopPropagation()
    console.log(' cancel')
    onCancel()
  }

  return (
    <div className='absolute bottom-0 left-0 bg-black w-full p-4 mx-auto z-10'>
      <p className='text-center text-lgl pb-4'>{isCompleted ? 'Mark as uncompleted?' : 'Mark as completed?'}</p>
      <div className='flex justify-center gap-8'>
        <button onClick={handleCancel} className='bg-white text-black px-4 py-2 rounded'>NO</button>
        <button onClick={handleConfirm} className='bg-white text-black px-4 py-2 rounded'>YES</button>
      </div>
    </div>
  )
}