'use client'
import { getUserById } from '@/lib/actions'
import { createContext, useContext, useState, useEffect } from 'react'

const userContext = createContext()

const useUser = () => {
  const context = useContext(userContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

const Provider = ({ session, children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(session?.user)
  }, [])
  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  )
}

export { Provider, useUser }
