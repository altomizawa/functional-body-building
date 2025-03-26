'use client'
const LogoutButton = ({logout}) => {
  return (
    <button onClick={logout} className="fixed top-8 left-8 border-[1px] px-4 py-2 border-black rounded-lg">logout</button>
  )
}

export default LogoutButton