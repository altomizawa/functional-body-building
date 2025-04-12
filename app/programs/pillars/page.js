'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ideaIcon from '@/public/icons/idea.svg';
import { YouTubeEmbed } from "@next/third-parties/google";
import Link from 'next/link';
import { markWorkoutAsCompleted, getLatestCompletedWorkout, fetchWorkout, getAllMovements } from '@/lib/actions';
import { getQueryValue, createVideoArray } from '@/utils/utils';
import { useToast } from '@/hooks/use-toast';

function Page() {
  // Consolidated state
  const programList = ['Pillars', 'Cycle 2', 'Cycle 3', 'Cycle 4'];
  const [workoutData, setWorkoutData] = useState({
    workout: null,
    program: 'Pillars',
    week: 1,
    day: 1,
    programIndex: 0
  });
  const [movements, setMovements] = useState([]);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  // Simplified navigation handlers
  const navigate = (type, direction) => {
    setWorkoutData(prev => {
      const newData = {...prev};
      
      if (type === 'program') {
        const newIndex = prev.programIndex + (direction === 'next' ? 1 : -1);
        if (newIndex >= 0 && newIndex < programList.length) {
          newData.programIndex = newIndex;
          newData.program = programList[newIndex];
          newData.week = 1;
          newData.day = 1;
        }
      } 
      else if (type === 'week') {
        const newWeek = prev.week + (direction === 'next' ? 1 : -1);
        if (newWeek >= 1 && newWeek <= 6) {
          newData.week = newWeek;
        }
      }
      else if (type === 'day') {
        const newDay = prev.day + (direction === 'next' ? 1 : -1);
        if (newDay >= 1 && newDay <= 7) {
          newData.day = newDay;
        }
      }
      
      return newData;
    });
  };

  // Advance to next workout
  const advanceToNextWorkout = () => {
    // Logic to determine the next workout
    if (workoutData.day < 7) {
      // Move to next day in same week
      navigate('day', 'next');
    } else if (workoutData.week < 6) {
      // Move to first day of next week
      setWorkoutData(prev => ({
        ...prev,
        day: 1,
        week: prev.week + 1
      }));
    } else if (workoutData.programIndex < programList.length - 1) {
      // Move to first day of first week of next program
      setWorkoutData(prev => ({
        ...prev,
        day: 1,
        week: 1,
        programIndex: prev.programIndex + 1,
        program: programList[prev.programIndex + 1]
      }));
    }
  };

  // Fetch user session
  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  };

  // Handle workout completion
  const handleWorkoutCompletion = async (e) => {
    e.preventDefault();
    
    if (!user?._id || !workoutData.workout?._id) {
      toast({
        title: "Error",
        description: "Missing user or workout information",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await markWorkoutAsCompleted({
        userId: user._id, 
        workoutId: workoutData.workout._id
      });
      
      if (!response.success) throw new Error(response.message);
      
      // Update user state to include the newly completed workout
      setUser(prevUser => {
        const newCompleted = [...(prevUser.completed || []), {
          pillarId: workoutData.workout._id,
          date: new Date()
        }];
        
        return {
          ...prevUser,
          completed: newCompleted
        };
      });
      
      toast({
        title: "Success",
        description: "Workout marked as completed!",
      });
      
      // Advance to next workout
      advanceToNextWorkout();
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark workout as completed",
        variant: "destructive"
      });
    }
  };

  // Check if workout is completed
  const isWorkoutCompleted = () => {
    if (!user?.completed || !workoutData.workout?._id) return false;
    return user.completed.some(entry => 
      entry.pillarId.toString() === workoutData.workout._id.toString()
    );
  };

  // Load workout based on current selection
  useEffect(() => {
    const loadWorkout = async () => {
      if (!user) return;
      
      try {
        const workout = await fetchWorkout(
          workoutData.program, 
          workoutData.week, 
          workoutData.day
        );
        setWorkoutData(prev => ({...prev, workout: workout.data}));
      } catch (err) {
        console.error('Error loading workout:', err);
      }
    };
    
    loadWorkout();
  }, [workoutData.program, workoutData.week, workoutData.day, user]);

  // Initial setup
  useEffect(() => {
    const initPage = async () => {
      // Load user and movements in parallel
      const [fetchedUser, fetchedMovements] = await Promise.all([
        fetchUserSession(),
        getAllMovements()
      ]);
      
      setUser(fetchedUser);
      setMovements(fetchedMovements.data || []);
      
      // If user has completed workouts, load the latest one
      if (fetchedUser?.completed?.length > 0) {
        const latestWorkout = await getLatestCompletedWorkout(fetchedUser._id);
        if (latestWorkout.data) {
          setWorkoutData(prev => ({
            ...prev,
            program: latestWorkout.data.program,
            week: latestWorkout.data.week,
            day: latestWorkout.data.day,
            workout: latestWorkout.data
          }));
        }
      }
    };
    
    initPage();
  }, []);

  const { workout, program, week, day } = workoutData;

  return (
    <>
      {/* Header */}
      <div className="bg-[rgba(0,0,0,0.3)] px-4 py-8 relative overflow-hidden">
        {user?.role === 'admin' && (
          <Link href="/programs" className='w-max text-center text-white px-4 py-2 rounded-md duration-300 hover:text-gray-400 flex items-center gap-2 justify-center'>
            <span className="material-symbols-outlined">arrow_back</span>BACK
          </Link>
        )}
        <Image 
          src="/images/Vitinho.jpg" 
          alt="background" 
          width={200} 
          height={200} 
          className="absolute top-[-25%] -z-10 left-0 w-full h-auto" 
        />
        
        {workout && (
          <>
            <h1 className="font-bold text-2xl text-white uppercase text-center">{workout.program}</h1>
            <h2 className="font-bold text-lg text-white uppercase text-center">
              Week {workout.week} | day {workout.day}
            </h2>
          </>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-8 py-4 bg-black">
        <button onClick={() => navigate('program', 'prev')} className='workout-button'>&lt;</button>
        <p className="uppercase text-white text-xl">{program}</p>
        <button onClick={() => navigate('program', 'next')} className='workout-button'>&gt;</button>
      </div>
      
      <div className="flex gap-12 justify-center items-center bg-slate-400 py-2">
        <div className="flex items-center gap-4 w-max">
          <button onClick={() => navigate('week', 'prev')} className='workout-button'>&lt;</button>
          <p className="uppercase text-white text-xl">WEEK {week}</p>
          <button onClick={() => navigate('week', 'next')} className='workout-button'>&gt;</button>
        </div>
        
        <div className="flex items-center gap-4 w-max">
          <button onClick={() => navigate('day', 'prev')} className='workout-button'>&lt;</button>
          <p className="uppercase text-white text-xl">DAY {day}</p>
          <button onClick={() => navigate('day', 'next')} className='workout-button'>&gt;</button>
        </div>
      </div>

      {/* Completion Form */}
      {isWorkoutCompleted() && <p className='bg-green-500 w-full text-white text-center p-2 font-bold'>WORKOUT DONE</p>}

      {/* Workout Content */}
      {workout ? (
        <div className="mt-4 mb-12">
          {workout.sections?.map((section, index) => (
            <div key={index}>
              <div className="w-full bg-black px-4 py-2 mt-8">
                <h3 className="text-white font-bold text-base flex items-center uppercase">
                  <Image src={ideaIcon} alt="icon" width={24} height={24} className="mr-2" />
                  {section.section}
                </h3>
              </div>

              <div className="w-[90%] mx-auto mt-4 space-y-2">
                <p className="whitespace-pre-line pt-2">{section.description}</p>
              </div>

              {/* Videos */}
              {createVideoArray(movements, section.description).length > 0 && (
                <div className="w-[90%] mx-auto mt-4 space-y-2">
                  <h3>VIDEOS ({createVideoArray(movements, section.description).length}):</h3>
                  <div className="w-full mx-auto mt-2 space-y-2 flex gap-4 items-center overflow-auto">
                    {createVideoArray(movements, section.description).map((video, idx) => (
                      <div key={idx} className="flex flex-col">
                        <p className="text-xs font-bold">{video.name.toUpperCase()}</p>
                        <YouTubeEmbed videoid={getQueryValue(video.link)} width={400} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {section.notes && (
                <div className="w-[90%] mx-auto mt-4">
                  <h3>NOTES:</h3>
                  <p className="whitespace-pre-line text-sm">{section.notes}</p>
                </div>
              )}
            </div>
          ))}
          {!isWorkoutCompleted() && <button
            onClick={handleWorkoutCompletion}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-8 mx-auto block"
          >
            Mark as Completed
          </button>}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[80vh]">
          <h1 className="font-bold text-2xl text-black uppercase">No workout found</h1>
        </div>
      )}
      
    </>
  );
}

export default Page;
