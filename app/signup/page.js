import React from 'react'
import { SignupForm } from '@/components/SignupForm'
import KOR__logo from '@/public/images/KOR_Somente_Red.svg'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'

const SignUp = async () => {
  const session = await verifySession()
  console.log('role: ', session?.role)
  if (session.role !== 'admin') redirect('/programs/pillars')
      


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className='absolute top-8 lef-0 w-full'>
        <Image src={KOR__logo} alt="logo" width={200} height={200} className="w-16 md:w-[120px] h-auto mx-auto" />
        <h1 className="text-sm md:text-xl text-center">FUNCTIONAL BODYBUILDING</h1>
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground mt-2">Enter your information to get started</p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}

export default SignUp
