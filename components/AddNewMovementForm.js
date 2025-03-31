'use client'
import React from 'react'
import Link from 'next/link'

const AddNewMovementForm = ({ handleSubmit, handleFormChange, formData }) => {
  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
      <label htmlFor='name'>Exercise Name: </label>
      <input type="text" name='name'placeholder="Movement Name" onChange={handleFormChange} value={formData.name} />
      <label className='mt-4' htmlFor='link'>Exercise video link: </label>
      <input type="string" name='link' placeholder="Link" onChange={handleFormChange} value={formData.link} />
      <button className='button__submit mt-8 uppercase' type='submit'>Add Movement</button>
      <Link href="/" className='button__back mt-4'>BACK</Link>

    </form>
  )
}

export default AddNewMovementForm
