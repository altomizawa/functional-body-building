import { useState, useEffect } from 'react'

const EditMovementForm = ({setShowEditForm, movement}) => {
  const [formData, setFormData] = useState({
    id: `${movement._id}`,
    name: `${movement.name}`,
    link: `${movement.link}`
  })

  const updateMovement = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/movements/${movement._id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
      })
      if (!response.error) {
        setShowEditForm(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    console.log(formData)
  }

  return ( 
  <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50'>
    <form className='bg-white p-8 rounded-lg flex flex-col gap-4 w-3/4 md:w-1/2 relative'>
      <button type='button' className='absolute top-4 right-4 text-xl' onClick={() => setShowEditForm(false)}>X</button>
      <h2 className='uppercase font-bold'>Edit Movement</h2>
      <label htmlFor='name'>Name: </label>
      <input onChange={onChangeInput} type="text" name="name" defaultValue={formData.name} />
      <label htmlFor='link'>Link: </label>
      <input onChange={onChangeInput} type="text" name="link" defaultValue={formData.link} />
      <button className='w-full border-2 px-4 py-2 bg-black text-white rounded-lg' type="submit">Submit</button>
    </form>
  </div>
  )
}

export default EditMovementForm
