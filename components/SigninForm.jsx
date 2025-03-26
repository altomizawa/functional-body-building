'use client'
import User from '@/app/models/User'
import {signinUser} from '@/lib/actions'
import { useActionState, useState } from 'react'
import { redirect } from 'next/navigation'


export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, isPending] = useActionState(signinUser)
  
  if (state?.success) {
    localStorage.setItem('token', JSON.stringify(state.token))
    redirect('/programs')
  }
  

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-4 border-2 border-gray-200 p-4 rounded-md">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
          <input type="email" id="email" name="email" className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" placeholder="john.doe@email.com" />
        </label>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          Password
          <input type={showPassword ? "text" : "password"} id="password" name="password" className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" placeholder="*************" />
          <button onClick={() => setShowPassword(prev => !prev)} type='button' className='underline text-sm'>show password</button>
        </label>
        <button type='submit' className='w-full border-2 py-2 rounded-md bg-black text-white hover:bg-gray-500'>{isPending ? "Submitting" : "Let me in"}</button>
        {!state?.success && <p className="text-red-500 text-sm">{state?.error}</p>}
      </div>
    </form>
  
)}

