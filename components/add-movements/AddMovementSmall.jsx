"use client"

import { useState } from "react"
import { PlusCircle, Loader2 } from "lucide-react"
import { addNewMovement } from "@/lib/movementActions"
import { useToast } from "@/hooks/use-toast"

const AddNewMovementSmall = ({ movementName = '', initialName = '', onMovementAdded }) => {
  const nameToUse = movementName || initialName
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    const trimmedName = nameToUse.trim()
    const trimmedLink = link.trim()

    if (!trimmedName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Movement name is missing',
      })
      return
    }

    if (!trimmedLink) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a video link',
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
        <p className='text-MD font-medium text-neutral-300 whitespace-nowrap min-w-max'>
          <span className='text-red-400 mr-2'>CAN'T FIND?! </span>ADD MOVEMENT:
        </p>
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
          className='text-white cursor-pointer w-min disabled:opacity-50 hover:text-neutral-300 transition-colors shrink-0'
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

