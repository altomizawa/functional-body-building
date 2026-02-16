"use client"

import { useState, useRef } from "react"
import { findUserByName} from '@/lib/actions'
import { modifyUser } from '@/lib/actions'
import {  } from '@/utils/'
import useToast from '@/contexts/useToast'
import EditUserForm from '@/components/users/EditUserForm'
import Dropdown from '@/components/form/Dropdown'

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('expired')
  const { setToasts } = useToast()


  const searchInputRef = useRef(null)

  const handleInputChange = debounce( async (e) => {
    if (e.target.value.trim() === "") return setUsers([])
    if (e.target.value.length < 3) return
    
    try{
      const response = await findUserByName(e.target.value);
      if (!response.success) {
        throw new Error(response.error)
      }
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }

  }, 500)


  const handleSubmit = async(formdata) => {
    const data = {
      name: formdata.get('name'),
      email: formdata.get('email'),
      phone: formdata.get('phone'),
      status: formdata.get('status'),
      id: formdata.get('id')
    }    
    const response = await modifyUser(data)
    if (response.success) {
      setSelectedUser(null)
      setToasts((prev) => [
        ...prev, 
        {
          title: "Success",
          description: `${response.data.name} modified successfully`,
          variant: "success",
          duration: 5000
        }
      ])
      return
    }
    setToasts((prev) => [
      ...prev,
      {
      title: 'Error',
      description:`${response.error}, status: ${response.status}`,
      variant: 'error',
      duration: 5000
    }])
  }
  const addUser = (user) => {
    setSelectedUser(user)
    setUsers([])
    setStatus(user.status)
    searchInputRef.current.value = null
  }

  return (
      <div className='flex flex-col md:grid md:grid-cols-2 gap-12 h-full px-6 my-16 max-w-[1440px] mx-auto'>
        {/* FORM */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-left">USERS</h1>
          <div className='flex flex-col gap-2 mt-4 relative'>
            <label htmlFor="userSearch">SEARCH USER BY NAME: </label>
            <input 
              id="userSearch"
              onChange={handleInputChange}
              className='w-full' 
              type="text" 
              placeholder="Type user name" 
              required 
              autoComplete='off'
              ref={searchInputRef}
            />
            <div className='relative'>
              {users.length > 0 && (
                <Dropdown 
                  array={users} 
                  action={addUser}
                />
              )}

            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-left mx-auto">USER INFO</h1>
          <EditUserForm selectedUser={selectedUser} handleSubmit={handleSubmit} status={status} setStatus={setStatus}/>
        </div>
      </div>
  )
}
