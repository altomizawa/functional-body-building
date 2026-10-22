'use client'
import ConfirmationPopup from "@/components/smolovjr/confirmationPopup";
import { CheckCircle } from "lucide-react";

export default function WorkoutCard({ day, currentDay, setCurrentDay }) {
  return (
    <li onClick={(e) => {
      e.stopPropagation()
      setCurrentDay(day.id)
    }} key={day.id} className={`hover:opacity-80 cursor-pointer relative col-span-1 border border-neutral-800 p-4 ${day.completedDate ? 'bg-neutral-900' : ''}`}>
      <div>
        <p className='text-[5rem] font-bold uppercase text-neutral-400 '>{day.day}</p>
        <p className='text-lg text-neutral-600 -mt-8 ml-1'>Back Squat</p>
      </div>
      <div className='flex gap-12 w-full justify-center mt-8'>
        <div className='flex flex-col items-center -gap-4'>
          <p className=' text-[3rem] font-light'>{day.sets}</p>
          <p className='text-neutral-400'>SETS</p>
        </div>
        <div className='flex flex-col items-center -gap-4'>
          <p className=' text-[3rem] font-light'>{day.reps}</p>
          <p className='text-neutral-400'>REPS</p>

        </div>
        <div className='flex flex-col items-center -gap-4'>
          <p className=' text-[3rem] font-light'>{day.weight}</p>
          <p className='text-neutral-400'>WEIGHT(LBS)</p>
        </div>
      </div>
      <div className='flex justify-end mt-8 relative'>
        <div className='flex gap-2 items-center'>
          <span className='text-sm opacity-40'>{day.completedDate ? `Completed on ${day.completedDate}` : 'Not Completed'}</span>
          <CheckCircle size={32} className={day.completedDate ? 'text-green-500' : 'text-gray-500'} />
        </div>
      </div>
      {day.id === currentDay && <ConfirmationPopup onConfirm={() => setCurrentDay(null)} onCancel={() => setCurrentDay(null)} isCompleted={day.completedDate} />}
    </li >
  )
}