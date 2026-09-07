import { Button } from "./button"

export default function Popup({ title, action, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-8 rounded-lg">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        {children}
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="primary" className='w-full' onClick={onClose}>
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