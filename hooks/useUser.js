'use client' 
import { getSessionFromClient } from '@/lib/actions'
import { useState, useEffect, useContext, createContext } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: ''
  })

  useEffect(() => { 
  //   // Fetch user data from an API or local storage
    const fetchUser = async () => {
      const response = await getSessionFromClient()
      setUser(response)
    }
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const { user, setUser } = useContext(UserContext)
  if (!user) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return { user, setUser }
}

