'use client'
import { useState } from 'react'

const FormPage = () => {
  const [section, setSection] = useState(1)
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <button className='border p-4 rounded-lg' onClick={() => setSection(prev => prev - 1)}>remove section</button>
      <button className='border p-4 rounded-lg' onClick={() => setSection(prev => prev + 1)}>add section</button>
    
      <form className='flex flex-col gap-4 w-1/2'>
        <h1>{section}</h1>
        {Array.from({ length: section }, (_, index) => (
          <Section  key={index} />
        ))}

     
        
      </form>
    </div>
  )
}

function Section() {
  return (
    <>
      <input name='name' placeholder='name' />
      <textarea name='description' placeholder='description' />
      <input name='movements' placeholder='movements' />
      <textarea name='notes' placeholder='notes' />
    </>
  )
}
export default FormPage

