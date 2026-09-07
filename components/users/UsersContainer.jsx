"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { findUserByName, getPaginatedUsers } from '@/lib/actions'
import { modifyUser } from '@/lib/actions'
import useToast from '@/contexts/useToast'
import EditUserForm from '@/components/users/EditUserForm'
import { debounce } from '@/utils/debounce'
import Chip from '@/components/ui/Chip'
import SearchInput from '@/components/ui/SearchInput'

export default function UsersContainer({ users }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [status, setStatus] = useState('expired')
  const { setToasts } = useToast()
  const [userList, setUserList] = useState(users)
  const allUsersRef = useRef([])

  const searchInputRef = useRef(null)
  const searchIdRef = useRef(0)

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term) => {
        const currentSearchId = ++searchIdRef.current
        try {
          const response = await findUserByName(term)
          if (currentSearchId !== searchIdRef.current) return

          if (searchInputRef.current && searchInputRef.current.value.trim().length < 3) {
            setUserList(allUsersRef.current)
            return
          }

          if (!response.success) {
            setUserList([])
            return
          }
          setUserList(response.data)
        } catch (error) {
          if (currentSearchId !== searchIdRef.current) return
          console.error(error)
          setUserList([])
        }
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
    if (value.length === 0) {
      setUserList(users)
      return
    }
    if (value.length < 3) {
      debouncedSearch.cancel?.()
      searchIdRef.current++
      setUserList(allUsersRef.current)
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
      allUsersRef.current = allUsersRef.current.map((u) => (u._id === response.data._id ? response.data : u))
      setUserList((prev) => (prev ? prev.map((u) => (u._id === response.data._id ? response.data : u)) : prev))
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
    setStatus(user.status)
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
    setUserList(allUsersRef.current)
  }

  return (
    <div className='flex flex-col gap-12 h-full px-6 my-16 max-w-[1440px] mx-auto'>
      {/* USER LIST */}
      <div>
        <h1 className="text-5xl md:text-3xl font-bold text-right mb-4">USERS</h1>
        <SearchInput
          id="userSearch"
          ref={searchInputRef}
          onChange={handleInputChange}
          placeholder="Search User"
          autoComplete="off"
        />
        <ul className='flex flex-col overflow-y-auto pt-2 max-h-[70vh] mt-4'>
          {userList && userList.map((user) => (
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
        status={status}
        setStatus={setStatus}
        onClose={() => {
          setSelectedUser(null)
          searchIdRef.current++
          setUserList(users)
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
  status,
  setStatus,
  onClose
}) => {
  return (
    <div className={`fixed top-0 duration-500 ${selectedUser ? 'right-0' : '-right-full'} w-screen h-screen bg-black flex items-center justify-center flex-col px-8 transition-all duration-500`}>
      <button onClick={onClose} className="absolute top-4 left-4 text-4xl">X</button>
      <h1 className="text-2xl md:text-3xl font-bold w-full text-left text-7xl mb-12">EDIT USER</h1>
      {selectedUser ? <EditUserForm key={selectedUser._id} selectedUser={selectedUser} handleSubmit={handleSubmit} status={status} setStatus={setStatus} /> : <NoSelectedUser />}
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
