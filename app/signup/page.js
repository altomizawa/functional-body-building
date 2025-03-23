import React from 'react'
import { SignupForm } from '@/components/SignupForm'

const SignUp = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
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
