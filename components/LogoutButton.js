'use client'
import { logout } from '@/lib/auth'
const LogoutButton = () => {
  return (
    <button onClick={logout} className="border-[1px] px-4 py-2 border-black rounded-lg">logout</button>
  )
}

export default LogoutButton