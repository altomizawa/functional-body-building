"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Loader2 } from "lucide-react"
import { addNewMovement } from "@/lib/movementActions"
import { useToast } from "@/hooks/use-toast"

const AddNewMovementSmall = ({ initialName = '', onMovementAdded }) => {
  const [name, setName] = useState(initialName)
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (initialName !== undefined) {
      setName(initialName)
    }
  }, [initialName])

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    const trimmedName = name.trim()
    const trimmedLink = link.trim()

    if (!trimmedName || !trimmedLink) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a movement name and a video link',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await addNewMovement({
        name: trimmedName,
        link: trimmedLink
      })

      if (!response || response.error || !response.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response?.error || 'Failed to add movement',
        })
        return
      }

      toast({
        title: 'Success',
        description: `${response.data.name} added successfully.`,
      })

      setName('')
      setLink('')

      if (onMovementAdded && response.data) {
        onMovementAdded(response.data)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add movement',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className='border-b-[1px] border-white/40 p-2 w-full flex items-center gap-2'>
      <div className='flex gap-4 items-center w-full'>
        <input
          type="text"
          name='name'
          placeholder='Movement Name'
          autoComplete='off'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className='w-full p-2 bg-transparent border-b border-neutral-700 focus:outline-none focus:border-white'
        />
        <input
          type="text"
          name='link'
          placeholder='Movement Video URL'
          autoComplete='off'
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className='w-full p-2 bg-transparent border-b border-neutral-700 focus:outline-none focus:border-white'
        />
        <button
          type='button'
          onClick={handleSubmit}
          disabled={isLoading}
          className='text-white cursor-pointer w-min disabled:opacity-50 hover:text-neutral-300 transition-colors'
          title='Add movement'
        >
          {isLoading ? (
            <Loader2 className='animate-spin w-min' size={24} />
          ) : (
            <PlusCircle className='w-min' size={24} />
          )}
        </button>
      </div>
    </div>
  )
}

export default AddNewMovementSmall

