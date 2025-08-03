import React from 'react'
import LogoutButton from '@/components/LogoutButton'
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function layout ({ children }) {
  const session = await verifySession()
  // if (session.role !== 'admin') {
  //   redirect('/')
  // }

  return (
    <div>
      {children}
    </div>
  )
}

