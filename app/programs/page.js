'use client'
import { useState } from 'react'
import Image from 'next/image'
import ProgramSelection from '@/components/ProgramSelection'
import ideaIcon from '@/public/icons/idea.svg'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const page = () => {
  const [date, setDate] = useState()

  
  
  return (
    <>

      {/* PROFILE DETAILS */}
      <div className="flex gap-3 items-center">
        <div className='rounded-full overflow-hidden border-2 aspect-square w-[100px]'>
          <Image src="https://media.istockphoto.com/id/1371301832/photo/excited-young-man-wearing-denim-shirt.jpg?s=612x612&w=0&k=20&c=AtgXnYVh2GpkMGlLwjIYDAwQ6fFvr0ii591bsEaJyLk=" alt="profile picture" width={200} height={200} />
        </div>
        <h3 className='font-bold text-lg'>@altomizawa</h3>
      </div>
      
      <div className="bg-black p-4">
        <h1 className="font-bold text-2xl text-white">JANUARY CYCLE | PILLARS</h1>
        <h2 className="font-bold text-lg text-white uppercase">Week 1 | Day 1</h2>
      </div>

      {/* DATE AND PROGRAM SELECTION */}
      <div className="grid grid-cols-2 mt-4">
        <div className='flex gap-3 ml-4'>
          <a className='font-bold text-2xl' href="/programs">&lt;</a>
          <Popover>
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
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <a className='font-bold text-2xl' href="/programs">&gt;</a>
        </div>

        <ProgramSelection />
      </div>

      {/* WORKOUT */}
      <div className="mt-4">
        <div className='w-full bg-black px-4 py-2'>
          <h3 className='text-white font-bold text-base flex items-center'><Image src={ideaIcon} alt="icon" width={24} height={24} className='mr-2'/>COACH NOTE</h3>
        </div>
        <div className='w-[90%] mx-auto mt-2 space-y-2'>
          <h3>PART 1 - BARBELL WARM-UP</h3>
          <h3>2 SETS (WITH EMPTY BARBELL)</h3>
          <h3>Romanian Deadlift <span className='description'>10 reps</span></h3>

        </div>
      </div>
        {/* REST DAY */}
        {/* ACTIVE RECOVERY WORK */}
        {/* COACH NOTE */}
        {/* SHORT ON TIME */}
        {/* WARM UP */}
        {/* SPEED STRENGTH */}
        {/* STRENGTH INTENSITY */}
        {/* STRENGTH BALANCE */}
        {/* CONDITIONING */}
        {/* COOL DOWN */}


    </>
  )
}

export default page
