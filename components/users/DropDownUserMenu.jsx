import React from 'react'

const DropDownUserMenu = ({ users, setSelectedUser, setUsers, setStatus, searchInputRef }) => {
  return (
    <div className='absolute top-full left-0 w-full mt-1 border-[1px] border-gray-300 rounded-lg bg-white z-10 max-h-60 overflow-y-auto'>
      {users.map((user, index) => (
        <div 
          key={index} 
          className='p-2 cursor-pointer hover:bg-gray-100 uppercase'
          onClick={() => {
            setSelectedUser(user)
            setUsers([])
            setStatus(user.status)
            searchInputRef.current.value = null
          }}
        >
          {user.name}
        </div>
      ))}
    </div>
  )
}

export default DropDownUserMenu
