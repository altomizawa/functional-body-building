'use client'
import { useState } from 'react'
import ProfileFormInput from './ProfileFormInput'
import { updateProfile } from '@/lib/actions'
import { useUser } from '@/hooks/useUser'

const ProfileForm = ({ user }) => {
 const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  })

  const [selectedField, setSelectedField] = useState(null)

  const handleSubmit = async () => {
    const response = await updateProfile(user.id, formData) // Assuming this function updates the user profile
    if (response.success) {
      console.log('Profile updated successfully:', response.data)
    } else {
      console.error('Error updating profile:', response.error)
    }
  }


  return (
    <form action={handleSubmit} className='flex flex-col justify-center border-[1px] border-neutral-500 rounded-[10px] p-12 w-[400px] gap-4'>
        <h1 className='text-white uppercase text-4xl'>Edit Profile</h1>
        <div className='flex flex-col items-center gap-4'>
             <ProfileFormInput
              field='name'
              setSelectedField={setSelectedField}
              selectedField={selectedField}
              formData={formData}
              setFormData={setFormData}
            />
            <ProfileFormInput
              field='email'
              setSelectedField={setSelectedField}
              selectedField={selectedField}
              formData={formData}
              setFormData={setFormData}
            />
        </div>
          <button type='submit' className='bg-neutral-800 border-neutral-400 border-[1px] text-white rounded p-2 hover:bg-white hover:text-black transition-colors duration-300'>
            Save Changes
          </button>
      </form>
  )
}

export default ProfileForm