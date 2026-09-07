'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { format, addDays, subDays, parseISO, isSameDay, isValid } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export default function PumpWorkoutNavigation({ selectedDate, workout }) {
  const router = useRouter()
  const pathname = usePathname()
  const [popoverOpen, setPopoverOpen] = useState(false)

  // Determine current active date object
  let currentDateObj = new Date()
  if (selectedDate) {
    if (typeof selectedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [year, month, day] = selectedDate.split('-').map(Number)
      currentDateObj = new Date(year, month - 1, day)
    } else {
      const parsed = new Date(selectedDate)
      if (isValid(parsed)) {
        currentDateObj = parsed
      }
    }
  } else if (workout?.date) {
    const parsed = new Date(workout.date)
    if (isValid(parsed)) {
      currentDateObj = parsed
    }
  }

  const navigateToDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd')
    router.push(`${pathname}?date=${formatted}`)
    setPopoverOpen(false)
  }

  const handlePreviousDay = () => {
    const prev = subDays(currentDateObj, 1)
    navigateToDate(prev)
  }

  const handleNextDay = () => {
    const next = addDays(currentDateObj, 1)
    navigateToDate(next)
  }

  const handleToday = () => {
    navigateToDate(new Date())
  }

  const isCurrentDayToday = isSameDay(currentDateObj, new Date())

  return (
    <div className="w-full flex flex-col bg-black border-b border-neutral-800">
      {/* Date Navigation Bar */}
      <div className="flex justify-between items-center px-4 py-3 max-w-4xl mx-auto w-full">
        {/* Previous Day Button */}
        <button
          onClick={handlePreviousDay}
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Previous Day"
          aria-label="Previous Day"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Date Selector Popover */}
        <div className="flex items-center gap-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white transition-all group"
                title="Click to select date"
              >
                <CalendarIcon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                <span className="font-semibold text-base sm:text-lg uppercase tracking-wide">
                  {format(currentDateObj, 'EEEE, MMM d, yyyy')}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-auto p-0 bg-neutral-900 border-neutral-700 text-neutral-100 shadow-2xl"
            >
              <div className="p-3 border-b border-neutral-800 flex justify-between items-center">
                <span className="text-xs font-semibold uppercase text-neutral-400">Select Workout Date</span>
                <button
                  onClick={handleToday}
                  className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2 py-1 rounded transition-colors"
                >
                  Go to Today
                </button>
              </div>
              <Calendar
                mode="single"
                selected={currentDateObj}
                onSelect={(newDate) => {
                  if (newDate) navigateToDate(newDate)
                }}
                initialFocus
                className="bg-neutral-900 text-neutral-100"
              />
            </PopoverContent>
          </Popover>

          {/* Quick "Today" jump button if not on today */}
          {!isCurrentDayToday && (
            <button
              onClick={handleToday}
              className="text-xs uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-2.5 py-1.5 rounded border border-neutral-700 transition-colors hidden sm:inline-block"
            >
              Today
            </button>
          )}
        </div>

        {/* Next Day Button */}
        <button
          onClick={handleNextDay}
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Next Day"
          aria-label="Next Day"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Program / Cycle Sub-Header */}
      <div className="bg-neutral-900/90 py-2 px-4 border-t border-neutral-800/80 text-center">
        {workout ? (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-semibold uppercase tracking-wider text-neutral-300">
            {workout.cycle && (
              <span className="text-white font-bold">{workout.cycle}</span>
            )}
            {(workout.week !== undefined || workout.day !== undefined) && (
              <span className="text-neutral-400">
                {workout.week !== undefined && `WEEK ${workout.week}`}
                {workout.week !== undefined && workout.day !== undefined && ` • `}
                {workout.day !== undefined && `DAY ${workout.day}`}
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
            No Pump workout scheduled for this date
          </p>
        )}
      </div>
    </div>
  )
}
