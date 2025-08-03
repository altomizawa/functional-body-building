import ProfileForm from '@/components/profile/ProfileForm'
import { getUserById } from '@/lib/actions'

const Profile = async ({ params }) => {
  const { id } = await params
  const response = await getUserById(id) // Assuming this function fetches user data by ID\
  const sanitizedUser = JSON.parse(JSON.stringify({
    name: response.data.name,
    email: response.data.email,
    id: response.data._id,
  }))

  return (
    <div className='bg-neutral-900 h-screen flex items-center justify-center'>
      <ProfileForm user={sanitizedUser} />
    </div>
  )
}

export default Profile
