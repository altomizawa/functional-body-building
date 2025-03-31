'use client'
import { useState, useEffect } from 'react'
import AddNewMovementForm from '@/components/AddNewMovementForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { getMovements } from '@/lib/actions'
import EditMovementForm from '@/components/EditMovementForm'


const AddNewMovement = () => {
  const [formData, setFormData] = useState({
    name: '',
    link: ''
  })
  const [movements, setMovements] = useState([])
  const [filteredMovements, setFilteredMovements] = useState([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [currentMovement, setCurrentMovement] = useState(null)
  const [confirmation, setConfirmation] = useState(true)
  const toast = useToast().toast

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // FILTER LIST
    if (e.target.name === 'name') {
      setFilteredMovements(movements.filter(movement => movement.name.includes(e.target.value.toLowerCase())))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.name === '') {
      toast({
        title: 'Error',
        description: 'Please enter a movement name',
      })
      return
    } else if (formData.link === '') {
      toast({
        title: 'Error',
        description: 'Please enter a video link',
      })
      return
    }

    const response = await fetch(`/api/movements`, {
      method: 'POST', 
      body: JSON.stringify(formData)
    })
    if (!response.ok) {
      toast({
        title: 'Error',
        description: data.error,
      })
    } else {
      const data = await response.json()
      toast({
        title: 'Success',
        description: 'Movement added successfully',
      })
    }
    setFormData({
      name: '',
      link: '' 
    })
  }

  const handleEditMovement = (movement) => {
    setShowEditForm(true)
    setCurrentMovement(movement)
  }
  
  const handleDeleteMovement = async (movement) => {
    const res = await fetch(`/api/movements/${movement._id}`, {
      method: 'DELETE',
      // body: JSON.stringify({ id: movement._id })
    })
    if (res.ok) {
      const deletedMovement = await res.json()
      toast({
        title: 'Success',
        description: `${deletedMovement.name} deleted successfully`,
      })
    } else {
      toast({
        title: 'Error',
        description: deletedMovement.error,
      })
    }
  }
  


  useEffect(() => {
    console.log('movements page')
    async function getMovements() {
      const response = await fetch(`/api/movements`, {
        method: 'GET'
      })
      const data = await response.json()
      setMovements(data)
    }
    getMovements()
  }, [])

  return (
    <main className='flex flex-col items-center h-screen'>
      <div className='m-8 p-4 rounded-lg w-[90%] md:w-3/4 lg:w-1/2'>
        <h1 className="text-4xl font-bold text-center sm:text-center w-full mb-12">ADD NEW MOVEMENT</h1>
        <Toaster />
        {showEditForm && <EditMovementForm setShowEditForm={setShowEditForm} movement={currentMovement} />}
        <AddNewMovementForm handleSubmit={handleSubmit} handleFormChange={handleFormChange} formData={formData} />
        <div className='mt-8 border-[1px] border-gray-500 p-4 rounded-lg'>
          <h2 className='font-bold border-b-[1px] border-black'>FOUND MATCHES:</h2>
          <ul className='space-y-2 mt-4'>
            {filteredMovements.map(movement => (
              <div key={movement._id} className='flex justify-between w-full items-center border-b-2 pb-2'>
                <li>{movement.name.toUpperCase()}</li>
                <div className='space-x-4'>
                  <Link href={movement.link} target='_blank' className='rounded-md underline text-gray-400'>video</Link>
                  <button type='button' onClick={() => handleEditMovement(movement)} className='rounded-md bg-blue-500 text-white px-4 py-1'>edit</button>
                  <button type='button' onClick={() => handleDeleteMovement(movement)} className='rounded-md bg-red-500 text-white px-4 py-1'>delete</button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

export default AddNewMovement
