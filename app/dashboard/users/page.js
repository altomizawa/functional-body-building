"use client"

import { useState, useRef } from "react"
import Link from 'next/link'
import { findUserByName} from '@/lib/actions'
import { modifyUser } from '@/lib/actions'
import { debounce } from '@/utils/debounce'
import useToast from '@/contexts/useToast'

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
      console.log(response.data)
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
            {users.length > 0 && (
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
            )}
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-left mx-auto">USER INFO</h1>
          <form action={handleSubmit} className='rounded-lg mt-4 space-y-4'>
            <input className='w-full' type="text" name="name" placeholder="Name" defaultValue={selectedUser ? selectedUser.name : ''} required />
            <input className='w-full' type="email" name="email" placeholder="Email" defaultValue={selectedUser ? selectedUser.email : ''} required />
            <input className='w-full' type="tel" id="phone" name="phone" pattern="\(\d{2}\) \d{4,5}-\d{4}" placeholder="(99) 99999-9999" defaultValue={selectedUser ? selectedUser.phone : ''} />
            <select className='w-full border-2 p-2' id="status" name="status" onChange={(e) => setStatus(e.target.value)} value={status}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
            <input type="hidden" name="id" value={selectedUser ? selectedUser._id : ''} />
            <div className='flex flex-col gap-4 mt-4'>
              <Link href="/" className='button__back'>BACK</Link>
              <button type='submit' className='button__submit'>SUBMIT</button>
            </div>
          </form>
        </div>
      </div>
  )
}
