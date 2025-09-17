'use client'
import React from 'react'
import Link from 'next/link'

const AddNewMovementForm = ({ handleSubmit, handleChange }) => {
  return (
    <form action={handleSubmit} className='flex flex-col'>
      <label htmlFor='name'>Exercise Name: </label>
      <input type="text" name='name' placeholder="Movement Name" onChange={handleChange} autoComplete='off'/>
      <label className='mt-4' htmlFor='link'>Exercise video link: </label>
      <input type="string" name='link' placeholder="Link" autoComplete='off'/>
      <button className='button__submit mt-4 uppercase' type='submit'>Add Movement</button>
    </form>
  )
}

export default AddNewMovementForm
