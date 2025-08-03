import { useState } from 'react'
import { Pencil } from 'lucide-react'

const ProfileFormInput = ({ field, formData, setFormData }) => {
  
  const [selectedField, setSelectedField] = useState(null)
  
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setSelectedField(null)
  }

  return selectedField === field ? (
    <input
      type='text'
      name={field}
      className='bg-gray-900 text-white rounded w-full p-2'
      placeholder={`Enter your ${field}`}
      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
      autoFocus
      onClick={() => setSelectedField(field)}
      onBlur={() => setSelectedField(null)}
      value={formData[field]}
    />
  ) : (
    <p
      onClick={() => setSelectedField(field)}
      className='text-white w-full flex justify-between items-center border-b-[1px] border-white cursor-pointer'
    >
      {formData[field]}
      <span>
        <Pencil size={14} className='inline-block' />
      </span>
    </p>
  )
}
export default ProfileFormInput