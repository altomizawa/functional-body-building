import { CircleCheckBig } from 'lucide-react';

const WorkoutComplete = () => {
  return (
    <div className='bg-green-500 w-full py-6 flex justify-center items-center gap-2'>
      <CircleCheckBig color='white' />
      <p className= 'text-white text-center font-bold'>WORKOUT DONE</p>
    </div>
  )
}

export default WorkoutComplete
