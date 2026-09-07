'use client'

import React, { useState, useEffect } from 'react'
import Chip from './Chip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DropdownInput({
  name,
  placeholder,
  defaultValue,
  required,
  options = [],
  variant,
  hasChip,
}) {
  const [value, setValue] = useState(defaultValue || '')

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  return (
    <Select name={name} value={value} onValueChange={setValue} required={required}>
      <SelectTrigger
        id={name}
        className="w-full bg-transparent border-0 border-b border-neutral-700 rounded-none text-xl text-neutral-300 px-0 h-auto py-1 focus:ring-0 focus:outline-none shadow-none justify-between [&>span]:flex [&>span]:items-center"
      >
        <SelectValue placeholder={placeholder || 'Select...'}>
          {value ? (
            hasChip ? (
              <div className="flex items-center">
                <Chip status={value} />
              </div>
            ) : (
              value
            )
          ) : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-neutral-900 border-neutral-700 text-neutral-200">
        {options.map((option) => (
          <SelectItem
            key={option}
            value={option}
            className="cursor-pointer focus:bg-neutral-800 focus:text-white"
          >
            {hasChip ? <Chip status={option} /> : option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}