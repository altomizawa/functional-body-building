import React from 'react'
import Link from 'next/link'

const EditUserForm = ({
  selectedUser, 
  setStatus, 
  status, 
  handleSubmit
}) => {
  return (
    <form action={handleSubmit} className='rounded-lg mt-4 space-y-4'>
      <input className='w-full' type="text" name="name" placeholder="Name" defaultValue={selectedUser ? selectedUser.name : ''} required />
      <input className='w-full' type="email" name="email" placeholder="Email" defaultValue={selectedUser ? selectedUser.email : ''} required />
      <input className='w-full' type="tel" id="phone" name="phone" pattern="\(\d{2}\) \d{4,5}-\d{4}" placeholder="(99) 99999-9999" defaultValue={selectedUser ? selectedUser.phone : ''} />
      <select className='w-full border-2 p-2' id="status" name="status" onChange={(e) => setStatus(e.target.value)} value={status}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="expired">Expired</option>
      </select>
      <input type="hidden" name="id" value={selectedUser ? selectedUser._id : ''} />
      <div className='flex flex-col gap-4 mt-4'>
        <Link href="/" className='button__back'>BACK</Link>
        <button type='submit' className='button__submit'>SUBMIT</button>
      </div>
    </form>
  )
}

export default EditUserForm
