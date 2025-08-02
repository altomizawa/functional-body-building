import React from 'react'

const FormContainer = ({ children, formAction }) => {
  return (
    <form action={formAction} className="w-[100%] md:w-[480px] space-y-6 bg-white shadow-md rounded-md p-6 border-2 border-black/20">
      {children}
    </form>
  )
}

export default FormContainer
