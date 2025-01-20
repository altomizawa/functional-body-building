'use client'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const DateSelector = ({date, setDate}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    console.log(selectedDate.toISOString().split('T')[0])
    setIsOpen(false)
  }

  const removeOneDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    setDate(newDate)
  }
  const addOneDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    console.log('next day')
    setDate(newDate)
  }

  return (
    <div>
      <div className='flex gap-3 ml-4'>
          <button onClick={removeOneDay} className='font-bold text-2xl' href="/programs">&lt;</button>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <button onClick={addOneDay} className='font-bold text-2xl' href="/programs">&gt;</button>
        </div>
    </div>
  )
}

export default DateSelector
