'use client'
import React from 'react'

const AddNewMovementForm = ({ handleSubmit, handleFormChange, formData }) => {
  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
      <label htmlFor='name'>Exercise Name: </label>
      <input type="text" name='name'placeholder="Movement Name" onChange={handleFormChange} value={formData.name} />
      <label htmlFor='link'>Exercise video link: </label>
      <input type="string" name='link' placeholder="Link" onChange={handleFormChange} value={formData.link} />
      <button className='bg-green-400 mt-8 py-2 px-4 rounded-md text-white uppercase font-bold duration-300 hover:bg-green-300' type='submit'>Add Movement</button>
    </form>
  )
}

export default AddNewMovementForm
