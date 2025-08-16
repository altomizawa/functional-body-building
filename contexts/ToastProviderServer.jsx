'use client'
import { ToastProvider } from './useToast'

import React from 'react'

const ToastProviderServer = ({ children }) => {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  )
}

export default ToastProviderServer
