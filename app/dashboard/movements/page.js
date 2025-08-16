'use client'
import { useState } from 'react'
import AddNewMovementForm from '@/components/AddNewMovementForm'
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link'
import { getAllMovements, addNewMovement } from '@/lib/movementActions'
import EditMovementForm from '@/components/EditMovementForm'
import { findMovementByName, deleteMovement } from '@/lib/movementActions'
import { debounce } from '@/utils/debounce'
import useToast from '@/contexts/useToast'

const AddNewMovement = () => {
  const [movements, setMovements] = useState([])
  const [currentMovement, setCurrentMovement] = useState(null)
  const { setToasts } = useToast()


  const handleSubmit = async (formdata) => {
    const data = {
      name: formdata.get('name'),
      link: formdata.get('link')
    }
    if (data.name === '' || data.link === '') {
      setToasts(prev => [
        ...prev,
        {
          title: 'Error',
          description: 'Please enter a movement name and a video link',
          variant: 'error',
          onClose: () => setToasts([]),
          duration: 5000
        }
      ])
      return
    }

    const response = await addNewMovement(data)
    if (response.error) {
      setToasts(prev => [
        ...prev,
        {
          variant: 'destructive',
          title: 'Error',
          description: `${response.error}, status: ${response.status}`,
          duration: 5000
        }
      ])
    } else {
      setToasts(prev => [
        ...prev,
        {
          variant: 'success',
          title: 'Success',
          description: `${response.data.name} added successfully.`,
          duration: 5000
        }
      ])
    }
  }

  
  const handleDeleteMovement = async (movement) => {
    console.log(movement._id)
    const response = await deleteMovement(movement._id)
    if (!response.success) {
      setToasts(prev => [
        ...prev,
        {
          variant: 'destructive',
          title: 'Error',
          description: `${response.error}, status: ${response.status}`,
          duration: 5000
        }
      ])
    } else {
       setToasts(prev => [
        ...prev,
        {
          variant: 'success',
          title: 'Success',
          description: `${response.data.name} deleted successfully.`,
          duration: 5000
        }
      ])
    }
    setMovements([])
  }

  const fetchMovements = debounce(async (e) => {
    if(e.target.value==='') setMovements([])
    if(e.target.value.length < 3) return;
    const response = await findMovementByName(e.target.value)
    setMovements(response.data)
  }, 500)

  return (
    <main className='flex flex-col h-full px-6 my-16 max-w-[1024px] mx-auto'>
      <h1 className="text-2xl md:text-3xl font-bold text-left w-full mb-12">ADD NEW MOVEMENT</h1>
      <Toaster />
      {currentMovement && <EditMovementForm setCurrentMovement={setCurrentMovement} movement={currentMovement} setMovements={setMovements} />}
      <AddNewMovementForm handleSubmit={handleSubmit} handleChange={fetchMovements} />
      <div className='mt-8 border-[1px] border-gray-500 p-4 rounded-lg'>
        <h2 className='text-2xl md:text-3xl font-bold border-b-[1px] border-black'>FOUND MATCHES:</h2>
        <ul className='space-y-2 mt-4'>
          {movements ? movements.map(movement => (
            <div key={movement._id} className='flex flex-col md:flex-row items-start justify-between w-full md:items-center border-b-2 pb-2'>
              <div className='flex flex-col md:flex-row w-full md:gap-4 flex-wrap'>
                <li>{movement.name.toUpperCase()}</li>
                <Link href={movement.link} target='_blank' className='rounded-md underline text-gray-400'>video</Link>
              </div>
              <div className='space-x-4 w-full flex justify-end'>
                <button type='button' onClick={() => setCurrentMovement(movement)} className='bg-blue-400 text-white px-4 py-1'>edit</button>
                <button type='button' onClick={() => handleDeleteMovement(movement)} className='rounded-md bg-red-400 text-white px-4 py-1'>delete</button>
              </div>
            </div>
          )) : <p className='text-gray-500'>No matches found</p>}
        </ul>
      </div>
    </main>
  )
}

export default AddNewMovement
