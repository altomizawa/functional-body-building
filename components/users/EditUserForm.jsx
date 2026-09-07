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
  onClose,
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
    <form action={handleSubmit} className='rounded-lg mt-4 space-y-4 w-full md:w-2/3 max-w-[1080]'>
      <h1 className="text-2xl font-bold w-full text-left text-7xl mb-12">EDIT USER</h1>
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
        defaultValue={selectedUser.status}
        required={true}
        options={['active', 'inactive', 'expired']}
        hasChip={true}
        variant
      />
      <input type="hidden" name="id" value={selectedUser ? selectedUser._id : ''} />
      <div className='flex w-full gap-2'>
        <Button type='button' variant='outline' className='flex-1' onClick={onClose}>CANCEL</Button>
        <Button type='submit' variant='primary' className='flex-1'>UPDATE</Button>
      </div>
      <Button type='button' variant='destructive' className='w-full' onClick={() => setDeletePopup(true)}>DELETE USER</Button>
      {deletePopup && <Popup title='Delete user' onClose={() => setDeletePopup(false)} action={() => DeleteUser(selectedUser._id)}>
        <p>Are you sure you want to delete this user?</p>
      </Popup>}
    </form>
  )
}

export default EditUserForm
