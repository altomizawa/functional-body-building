import { Button } from "./button"
import { useRef, useEffect } from "react"

export default function Popup({ title, action, onClose, children }) {
  const popupRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeydown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div ref={popupRef} className="bg-neutral-800 p-8 rounded-lg">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        {children}
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" className='w-full' onClick={onClose}>
            NO
          </Button>
          <Button variant="destructive" className='w-full' onClick={action}>
            YES
          </Button>
        </div>
      </div>
    </div>
  )
}