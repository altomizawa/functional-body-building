"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { modifyUser } from '@/lib/actions'
import useToast from '@/contexts/useToast'
import EditUserForm from '@/components/users/EditUserForm'
import { debounce } from '@/utils/debounce'
import Chip from '@/components/ui/Chip'
import SearchInput from '@/components/ui/SearchInput'
import { useRouter, useSearchParams } from "next/navigation"

export default function UsersContainer({ users }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') ?? "")
  const [selectedUser, setSelectedUser] = useState(null)
  const { setToasts } = useToast()

  const searchInputRef = useRef(null)
  const searchIdRef = useRef(0)

  const debouncedSearch = useMemo(
    () => debounce(async (term) => {
      router.push(`/dashboard/users?q=${term}`)
    }, 700),
    []
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.()
    }
  }, [debouncedSearch])

  const handleInputChange = (e) => {
    const value = e.target.value.trim()
    setQuery(value)
    if (value.length === 0) {
      router.push(`/dashboard/users`)
      return
    }
    if (value.length < 3) {
      debouncedSearch.cancel?.()
      searchIdRef.current++
      return
    }
    debouncedSearch(value)
  }

  const handleSubmit = async (formdata) => {
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
        description: `${response.error}, status: ${response.status}`,
        variant: 'error',
        duration: 5000
      }])
  }
  const addUser = (user) => {
    debouncedSearch.cancel?.()
    searchIdRef.current++
    setSelectedUser(user)
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
  }

  return (
    <div className='flex flex-col gap-12 h-full px-6 my-16 max-w-[1440px] mx-auto'>
      {/* USER LIST */}
      <div>
        <h1 className="text-5xl font-bold text-right mb-4">USERS</h1>
        <SearchInput
          id="userSearch"
          ref={searchInputRef}
          onChange={handleInputChange}
          placeholder="Search User"
          autoComplete="off"
          value={query}
        />
        <ul className='flex flex-col overflow-y-auto pt-2 max-h-[70vh] mt-4'>
          {users && users.map((user) => (
            <button key={user._id} onClick={() => addUser(user)} className='flex justify-between px-4 py-2 hover:bg-neutral-400/40 border-b border-neutral-700'>
              <p className='text-left text-xl'>{user.name.toUpperCase()}</p>
              <Chip status={user.status} />
            </button>
          ))}
        </ul>

      </div>

      {/* USER DETAILS */}
      <UserDetails
        selectedUser={selectedUser}
        handleSubmit={handleSubmit}
        // status={status}
        onClose={() => {
          setSelectedUser(null)
          searchIdRef.current++
          debouncedSearch.cancel?.()
        }}
      />
      {/* <SignupForm /> */}
    </div>
  )
}

const UserDetails = ({
  selectedUser,
  handleSubmit,
  // status,
  onClose
}) => {
  console.log('selected User: ', selectedUser)
  return (
    <div className={`fixed top-0 duration-500 ${selectedUser ? 'right-0' : '-right-full'} w-screen h-screen bg-black flex items-center justify-center flex-col px-8 transition-all duration-500`}>
      {selectedUser ? <EditUserForm key={selectedUser._id} selectedUser={selectedUser} handleSubmit={handleSubmit} onClose={onClose} /> : <NoSelectedUser />}
    </div>
  )
}

const NoSelectedUser = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-lg text-gray-500">Select a user to edit</p>
    </div>
  )
}
