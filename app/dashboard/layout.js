import React from 'react'
import LogoutButton from '@/components/LogoutButton'
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function layout ({ children }) {
  const session = await verifySession()
  if (session.role !== 'admin') {
    redirect('/')
  }

  return (
    <div>
      <div className='absolute top-4 right-4'>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}

