"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { getAllUsers } from '@/lib/actions'
import { modifyUser } from '@/lib/actions'

export default function UsersContainer() {
  const [allUsers, setAllUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const toast = useToast().toast

  const fetchAllUsers = async () => {
    const response = await getAllUsers();
    if (response.success) {
      setAllUsers(response.data)
      setFilteredUsers(response.data)
      return
    }
    toast({
      title: 'Error',
      description: 'Failed to fetch users',
    })
  }

  const handleInputChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.length > 0) {
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredUsers(allUsers);
      setShowDropdown(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.name);
    setShowDropdown(false);
  }

  const handleInputFocus = () => {
    if (searchTerm.length > 0) {
      setShowDropdown(true);
    }
  }

  const handleSubmit = async(formData) => {
    const { email, name, phone, status } = Object.fromEntries(formData)
    
    const response = await modifyUser({email, name, phone, status, id:selectedUser._id})
    if (response.success) {
      fetchAllUsers()
      setSearchTerm("")
      setSelectedUser(null)
      toast({
        title: "Success",
        description: `${response.data.name} modified successfully ${response.status}`,
        variant: "success",
      })
      return
    }
    toast({
      title: 'Error',
      description:`${response.error}, status: ${response.status}`,
    })
  }

  useEffect(() => {
    fetchAllUsers()
  },[])

  return (
      <div className='flex flex-col md:grid md:grid-cols-2 gap-12 h-full px-6 my-16 max-w-[1440px] mx-auto'>
        {/* FORM */}
        <div>
          <Toaster />
          <h1 className="text-2xl md:text-3xl font-bold text-left">USERS</h1>
          <div className='flex flex-col gap-2 mt-4 relative'>
            <label htmlFor="userSearch">SEARCH USER BY NAME: </label>
            <input 
              id="userSearch"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className='w-full' 
              type="text" 
              placeholder="Type user name" 
              required 
            />
            {showDropdown && filteredUsers.length > 0 && (
              <div className='absolute top-full left-0 w-full mt-1 border-[1px] border-gray-300 rounded-lg bg-white z-10 max-h-60 overflow-y-auto'>
                {filteredUsers.map((user, index) => (
                  <div 
                    key={index} 
                    className='p-2 cursor-pointer hover:bg-gray-100 uppercase'
                    onClick={() => handleSelectUser(user)}
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
            {/* <input className='w-full hidden' type="text" name="id" placeholder="Id" defaultValue={selectedUser ? selectedUser._id : ''} required /> */}
            <input className='w-full' type="text" name="name" placeholder="Name" defaultValue={selectedUser ? selectedUser.name : ''} required />
            <input className='w-full' type="email" name="email" placeholder="Email" defaultValue={selectedUser ? selectedUser.email : ''} required />
            <input className='w-full' type="tel" id="phone" name="phone" pattern="\(\d{2}\) \d{4,5}-\d{4}" placeholder="(99) 99999-9999" defaultValue={selectedUser ? selectedUser.phone : ''} />
            <select className='w-full border-2 p-2' id="status" name="status" defaultValue={selectedUser ? selectedUser.status : 'expired'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
            <div className='flex flex-col gap-4 mt-4'>
              <Link href="/" className='button__back'>BACK</Link>
              <button type='submit' className='button__submit'>SUBMIT</button>
            </div>
          </form>
        </div>
      </div>
  )
}
