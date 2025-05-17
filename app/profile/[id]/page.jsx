import { getUserById, updateUser } from "@/lib/actions"


const MyProfile = async ({params}) => {
  const {id} = await params
  const { data } = await getUserById(id)
  
  const handleSubmit =  async (formData) => {
    'use server'
    const userData = {
      id: id,
      name: formData.get('name') || data.name,
      email: formData.get('email') || data.email,
      password: formData.get('password') || data.password,
      confirmPassword: formData.get('confirmPassword'),
    }
    if (userData.password && userData.password !== userData.confirmPassword) {
      console.log('Passwords do not match') 
      return
    }

    updateUser(userData)
  }

  return (
    <div className='w-screen h-screen flex flex-col gap-4 justify-center items-center'>
      <h1 className='text-3xl font-bold'>MY PROFILE</h1>
      <form action={handleSubmit} className="flex flex-col gap-2 min-w-[300px]">
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor='name'>Name</label>
          <input type="text" name='name' placeholder={data.name} />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor='email'>Email</label>
          <input type="text" name='email' placeholder={data.email} />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor='password'>Password</label>
          <input type="password" name='password' placeholder="Password" />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input type="password" name='confirmPassword' placeholder="Confirm Password" />
        </div>
        <button className='button__submit' type="submit">Update Profile</button>
      </form>
    </div>
  )
}

export default MyProfile
