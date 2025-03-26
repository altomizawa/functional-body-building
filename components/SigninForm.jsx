'use client'
import User from '@/app/models/User'
// import {signinUser} from '@/lib/actions'
import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'


export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, isPending] = useActionState(signinUser)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()
  
  if (state?.success) {
    // localStorage.setItem('token', JSON.stringify(state.token))
    redirect('/login')
  }

  async function signinUser(e) {
    e.preventDefault();
    // get Values
    const email = formData.email
    const password = formData.password

    try {
      // Check if user already exists
      // const existingUser = await User.findOne({email: email})
      const existingUser = await fetch(`${process.env.BASE_URL}api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      if  (!existingUser) {
        return {
          success: false,
          error: "Email or password is incorrect",
        }
      }
      console.log('session successfully created')
      return router.push('/')
  
    } catch (error) {
      console.error("Signup error:", error)
  
      return {
        success: false,
        error: "Failed to login",
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  

  return (
    <form onSubmit={signinUser} className="space-y-6">
      <div className="space-y-4 border-2 border-gray-200 p-4 rounded-md">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
          <input onChange={handleChange} type="email" id="email" name="email" className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" placeholder="john.doe@email.com" />
        </label>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          Password
          <input onChange={handleChange} type={showPassword ? "text" : "password"} id="password" name="password" className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" placeholder="*************" />
          <button onClick={() => setShowPassword(prev => !prev)} type='button' className='underline text-sm'>show password</button>
        </label>
        <button type='submit' className='w-full border-2 py-2 rounded-md bg-black text-white hover:bg-gray-500'>{isPending ? "Submitting" : "Let me in"}</button>
        {!state?.success && <p className="text-red-500 text-sm">{state?.error}</p>}
      </div>
    </form>
  
)}

