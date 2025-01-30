'use client'
import { useState, useEffect } from 'react'
import AddNewMovementForm from '@/components/AddNewMovementForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { set } from 'mongoose'
import Link from 'next/link'

const AddNewMovement = () => {
  const [formData, setFormData] = useState({
    name: '',
    link: ''
  })
  const [movements, setMovements] = useState([])
  const [filteredMovements, setFilteredMovements] = useState([])
  // const [toast, setToast] = useState(false)
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
    const response = await fetch('/api/movements', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    const data = await response.json()
    if (data.error) {
      console.log(data.error)
      toast({
        title: 'Error',
        description: data.error,
      })
    } else {
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

  useEffect(() => {
    async function getMovements() {
      const response = await fetch('/api/movements', {
        method: 'GET'
      })
      const data = await response.json()
      setMovements(data)
    }
    getMovements()
  }, [])

  return (
    <div className='border-2 m-8 p-4 rounded-lg'>
      <Toaster />
      <h1>Add New Movement</h1>
      <AddNewMovementForm handleSubmit={handleSubmit} handleFormChange={handleFormChange} formData={formData} />
      <div className='mt-8 border-[1px] border-gray-500 p-4 rounded-lg'>
        <h2 className='font-bold border-b-2'>FOUND MATCHES:</h2>
        <ul className='space-y-2 mt-4'>
          {filteredMovements.map(movement => (
            <div key={movement._id} className='flex justify-between w-full items-center border-b-2 pb-2'>
              <li>{movement.name.toUpperCase()}</li>
              <Link href={movement.link} target='_blank' className='rounded-md underline text-gray-400'>video</Link> 
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AddNewMovement
