'use client'
import { UserProvider } from '@/hooks/useUser'

const UserProviderClient = ({ children }) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}

export default UserProviderClient
