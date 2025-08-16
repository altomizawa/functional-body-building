import { useContext, createContext, useState } from 'react'
import Toast from '@/components/Toast'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {toasts.length > 0 && toasts.map((toast) => (
        <Toast title={toast.title} description={toast.description} variant={toast.variant} key={toast.title} onClose={() => setToasts([])} duration={toast.duration} />
      ))}
      {children}
    </ToastContext.Provider>
  )
}

const useToast = () => {
  return useContext(ToastContext)
}

export default useToast

