import { useEffect } from 'react'
import { deleteWorkout } from '@/lib/workoutActions'
import { useToast } from '@/hooks/use-toast'


const DeletePopup = ({ setDeletePopup , deletePopup, workoutId }) => {
  const toast = useToast().toast
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDeletePopup(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const handleDelete = async () => {
    try{ 
      const response = await deleteWorkout(workoutId)
      if (response.success) {
        setDeletePopup(false)
        toast({
          title: 'Success',
          description: 'Workout deleted successfully',
          variant: 'success',
          color: '#fff',
        })
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error.error,
        variant: 'destructive',
        color: '#fff',
      })
    }
  }

  return (
    <>
      {deletePopup && <div className='fixed top-0 left-0 w-screen h-screen bg-black/80 text-white flex items-center justify-center gap-4'>
      <h1>Are you sure you want to delete this workout?</h1>
        <button className='w-48 bg-white text-center text-black px-4 py-2 rounded-md duration-300 hover:bg-gray-300' type='button' onClick={() => setDeletePopup(false)}>NO</button>
        <button className='w-48 bg-gray-800 text-center text-white px-4 py-2 rounded-md duration-300 hover:bg-black' type='button' onClick={() => handleDelete(workoutId)}>YES</button>
      </div>}
    </>
  )
}

export default DeletePopup
