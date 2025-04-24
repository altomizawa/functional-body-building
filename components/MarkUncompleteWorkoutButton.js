'use client'

import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { markWorkoutAsCompleted, markWorkoutAsUncompleted } from '@/lib/actions';


const MarkUncompleteWorkoutButton = ({ workoutId, userId }) => {
  const { toast } = useToast();
  const [confirmationVisible, setConfirmationVisible] = useState(false);


  // Handle workout uncompletion
    
    const handleWorkoutUncompletion = async (e) => {
      if (!userId || !workoutId) {
        console.log(workoutId, userId)
        toast({
          title: "Error",
          description: "Missing user or workout information",
          variant: "destructive"
        });
        return;
      }
  
      try {
        const response = await markWorkoutAsUncompleted({
          userId: userId, 
          workoutId: workoutId
        });
       
        
        if (!response.success) throw new Error(response.message);
        toast({
          title: "Success",
          description: "Workout marked as Uncompleted!",
        });
        // Optionally, you can refresh the page or update the UI here
        window.location.reload();
        
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to mark workout as uncompleted",
          variant: "destructive"
        });
      }
    };
  return (
    <>
      {confirmationVisible ? <div className='container bg-black  text-white px-4 py-4 rounded mx-auto block mb-4'>
        <h1 className='uppercase text-center'>Mark Workout as UNCOMPLETED?</h1>
        <div className='flex justify-center gap-8 mt-6'>
          <button onClick={() => setConfirmationVisible(false)} className='bg-white text-black px-4 py-2 rounded'>NO</button>
          <button onClick={handleWorkoutUncompletion} className='bg-red-600 text-white px-4 py-2 rounded'>YES</button>
        </div>
      </div> :
      <button onClick={() => setConfirmationVisible(true)}
        className="container bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mx-auto block mb-4"
      >
        Mark as UNCOMPLETED
      </button>}
    </>
  )
}

export default MarkUncompleteWorkoutButton
