import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Popup from '@/components/ui/Popup'
import { useToast } from '@/hooks/use-toast'
import { deleteUser } from '@/lib/actions'
import FormInput from '../ui/FormInput'
import DropdownInput from '../ui/DropdownInput'


const EditUserForm = ({
  selectedUser,
  setStatus,
  status,
  handleSubmit
}) => {
  const [deletePopup, setDeletePopup] = useState(false)

  const toast = useToast().toast


  const DeleteUser = async (userId) => {
    const { error } = await deleteUser(userId)
    if (error) {
      toast({
        title: 'Error',
        description: error,
      })
      return
    }
    setDeletePopup(false)
    toast({
      title: 'Success',
      description: 'User deleted successfully',
    })
  }

  return (
    <form action={handleSubmit} className='rounded-lg mt-4 space-y-4'>
      <FormInput
        name="name"
        placeholder="Name"
        defaultValue={selectedUser ? selectedUser.name : ''}
        required={true}
        uppercase
      />
      <FormInput
        name="email"
        placeholder="Email"
        defaultValue={selectedUser ? selectedUser.email : ''}
        required={true}
      />
      {console.log('selectedUser: ', selectedUser)}
      <FormInput
        name="phone"
        placeholder="Phone"
        defaultValue={selectedUser.phone ? selectedUser.phone : '(55) 5555-5555'}
        required={false}
      />
      <DropdownInput
        name="status"
        placeholder="Status"
        defaultValue={status}
        required={true}
        options={['active', 'inactive', 'expired']}
      />
      <input type="hidden" name="id" value={selectedUser ? selectedUser._id : ''} />
      <Button type='submit' variant='primary' className='w-full'>UPDATE</Button>
      <Button type='button' variant='destructive' className='w-full' onClick={() => setDeletePopup(true)}>DELETE USER</Button>
      {deletePopup && <Popup title='Delete user' onClose={() => setDeletePopup(false)} action={() => DeleteUser(selectedUser._id)}>
        <p>Are you sure you want to delete this user?</p>
      </Popup>}
    </form>
  )
}

export default EditUserForm
