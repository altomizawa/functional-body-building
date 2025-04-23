'use client'

import { useToast } from '@/hooks/use-toast';
import { markWorkoutAsCompleted } from '@/lib/actions';


const MarkCompleteWorkoutButton = ({ workout, user }) => {
  const { toast } = useToast();


  // Handle workout completion
    const handleWorkoutCompletion = async (e) => {
      if (!user.id || !workout._id) {
        console.log(workout._id, user.id)
        toast({
          title: "Error",
          description: "Missing user or workout information",
          variant: "destructive"
        });
        return;
      }
  
      try {
        const response = await markWorkoutAsCompleted({
          userId: user.id, 
          workoutId: workout._id
        });
       
        
        if (!response.success) throw new Error(response.message);
        toast({
          title: "Success",
          description: "Workout marked as completed!",
        });
        
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to mark workout as completed",
          variant: "destructive"
        });
      }
    };
  return (
    <>
      <button onClick={handleWorkoutCompletion}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-8 mx-auto block"
      >
        Mark as Completed
      </button>
    </>
  )
}

export default MarkCompleteWorkoutButton
