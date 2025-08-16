'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const Toast = ({ title, description, variant, onClose, duration }) => {
  const [isVisible, setIsVisible] = useState(false)
  const toastVariants = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
  }

  useEffect(() => {
    setTimeout(() => onClose(), duration)
  }, [])

  return (
    <div onMouseEnter={() => setIsVisible(true)}  onMouseLeave={() => setIsVisible(false)} className={`fixed top-4 right-4 shadow-xl p-4 ${toastVariants[variant]} z-[1000] rounded-[10px]`}>
      {isVisible && <button onClick={onClose} className={`absolute -top-3 -left-3 ${toastVariants[variant]} text-white cursor-pointer rounded-full shadow-md shadow-black/30 p-1`}><X size={12} /></button>}
      <h4 className='uppercase text-sm'>{title}</h4>
      <p className='text-xs'>{description}</p>
    </div>
  )
}

export default Toast
