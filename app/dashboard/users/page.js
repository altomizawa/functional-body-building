"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { getAllUsers } from '@/lib/actions'



export default function Users() {
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const toast = useToast()
  
  const handleSearch = async (e) => {
    console.log(e.target.value)
  }

  const selectUser = (user) => {
    setSelectedUser(user)
  }

  const fetchAllUsers = async () => {
    const response = await getAllUsers();
    if (response.success) {
      console.log(response.data)
      
      setSearchResults(response.data)
      toast.toast({
        title: "Success",
        description: "Users fetched successfully",
        variant: "success",
      })
      return
    }
    toast({
      title: 'Error',
      description: 'Please enter a user name',
    })
  }

  const handleInputChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredResults = searchResults.filter(result => result.name.toLowerCase().includes(searchTerm));
    setSearchResults(filteredResults);
  };

  useEffect(() => {
    fetchAllUsers()
  },[])
  return (
      <div className='flex flex-col md:grid md:grid-cols-2 gap-12 h-full px-6 my-16 max-w-[1440px] mx-auto'>
        {/* FORM */}
        <div>
          <Toaster />
          <h1 className="text-2xl md:text-3xl font-bold text-left">USERS</h1>
          <div className='flex flex-col gap-2 mt-4'>
            <label htmlFor="program">SEARCH USER BY NAME: </label>
            <input onChange={handleInputChange} className='w-full' type="text" name="program" placeholder="Type user name" required />
          </div>
          <ul className='flex flex-col gap-2 mt-4 border-[1px] border-gray-300 rounded-lg p-4'>
            {searchResults.map( (result, index) => (
              <li key={index} className='uppercase cursor-pointer duration-300 hover:text-gray-500 hover:underline underline-offset-4' onClick={() => setSelectedUser(result)}>{result.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-left mx-auto">USER INFO</h1>
          <form className='rounded-lg mt-4 space-y-4'>
            <input className='w-full' type="text" name="name" placeholder="Name" defaultValue={selectedUser ? selectedUser.name : ''} required />
            <input className='w-full' type="email" name="email" placeholder="Email" defaultValue={selectedUser ? selectedUser.email : ''} required />
            <input className='w-full' type="tel" id="phone" name="phone" pattern="\(\d{2}\) \d{4,5}-\d{4}" placeholder="(99) 99999-9999" defaultValue={selectedUser ? selectedUser.phone : ''} />
            <select className='w-full border-2 p-2' id="status" name="status" defaultValue={selectedUser ? selectedUser.status : 'Inactive'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </form>
          <div className='flex flex-col gap-4 mt-4'>
            <Link href="/" className='button__back'>BACK</Link>
            <button className='button__submit'>SUBMIT</button>
          </div>
        </div>
      </div>
  )
}

