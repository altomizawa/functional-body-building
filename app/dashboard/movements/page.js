'use client'
import { useState, useEffect } from 'react'
import AddNewMovementForm from '@/components/AddNewMovementForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { getAllMovements, addNewMovement } from '@/lib/actions'
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

    const response = await addNewMovement(formData)
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `${response.error}, status: ${response.status}`,
      })
    } else {  
      toast({
        title: 'Success',
        description: `${response.data.name} added successfully.`,
      })
      setFormData({
        name: '',
        link: ''
      })
      fetchAllMovements();
    }
  }

  const handleEditMovement = (movement) => {
    setShowEditForm(true)
    setCurrentMovement(movement)
  }
  
  const handleDeleteMovement = async (movement) => {
    const res = await fetch(`/api/movements/${movement._id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      toast({
        title: 'Error',
        description: deletedMovement.error,
        variant: 'destructive',
      })
    } else {
      const deletedMovement = await res.json()
      toast({
        title: 'Success',
        description: `${deletedMovement.name} deleted successfully`,
      })
      setFormData({
        name: '',
        link: ''
      })
      fetchAllMovements();
      setFilteredMovements([]);
    }
  }
  
  async function fetchAllMovements() {
    const response = await getAllMovements()
    if (response.error) {
      toast({
        title: 'Error',
        description: response.error,
      })
    }
    setMovements(response.data)
  }


  useEffect(() => {
    fetchAllMovements()
  }, [])

  return (
    <main className='flex flex-col h-full px-6 my-16 max-w-[1024px] mx-auto'>
      <h1 className="text-2xl md:text-3xl font-bold text-left w-full mb-12">ADD NEW MOVEMENT</h1>
      <Toaster />
      {showEditForm && <EditMovementForm setShowEditForm={setShowEditForm} movement={currentMovement} />}
      <AddNewMovementForm handleSubmit={handleSubmit} handleFormChange={handleFormChange} formData={formData} />
      <div className='mt-8 border-[1px] border-gray-500 p-4 rounded-lg'>
        <h2 className='text-2xl md:text-3xl font-bold border-b-[1px] border-black'>FOUND MATCHES:</h2>
        <ul className='space-y-2 mt-4'>
          {filteredMovements.length!==0 ? filteredMovements.map(movement => (
            <div key={movement._id} className='flex flex-col md:flex-row items-start justify-between w-full md:items-center border-b-2 pb-2'>
              <div className='flex flex-col md:flex-row w-full md:gap-4 flex-wrap'>
                <li>{movement.name.toUpperCase()}</li>
                <Link href={movement.link} target='_blank' className='rounded-md underline text-gray-400'>video</Link>
              </div>
              <div className='space-x-4 w-full flex justify-end'>
                <button type='button' onClick={() => handleEditMovement(movement)} className='bg-blue-400 text-white px-4 py-1'>edit</button>
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
