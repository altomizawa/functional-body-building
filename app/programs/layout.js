import React from 'react'
import { verifySession } from '@/lib/session';
import LogoutButton from '@/components/LogoutButton';

const layout = async ({ children }) => {
  const session = await verifySession(); // CHECK IF THERE'S A SESSION AND REDIRECT TO LOGIN IF NOT
  
  return (
    <div>
       <div className='absolute top-4 right-4'>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}

export default layout
