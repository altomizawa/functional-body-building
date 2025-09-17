import React from 'react'
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import BackLink from '@/components/BackLink'

export default async function layout ({ children }) {
  const session = await verifySession()
  if (session.role !== 'admin') {
    redirect('/')
  }

  return (
    <div>
      <BackLink href='/'>BACK</BackLink>
      {children}
    </div>
  )
}

