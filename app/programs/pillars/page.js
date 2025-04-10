'use client'
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import ideaIcon from '@/public/icons/idea.svg';
import { YouTubeEmbed } from "@next/third-parties/google";
import Link from 'next/link';
import { markWorkoutAsCompleted, getLatestCompletedWorkout, fetchWorkout, getAllMovements, getSessionFromClient} from '@/lib/actions';
import { set } from 'mongoose';
import { getQueryValue, createVideoArray } from '@/utils/utils';



function Page({ searchParams }) {
  const programList = ['Pillars', 'Cycle 2', 'Cycle 3', 'Cycle 4'];
  const [workout, setWorkout] = useState(null);
  const [program, setProgram] = useState('Pillars');
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);
  const [programIndex, setProgramIndex] = useState(0);
  const [movements, setMovements] = useState([]);
  const [user, setUser] = useState({});
  // FETCH WORKOUT FUNCTION
  async function getWorkout(program, week, day) {
    try {
      const workout = await fetchWorkout(program, week, day);
      setWorkout(workout.data)
    } catch (err) {
      console.error(err);
      return null; // Return null in case of error
    }
  }

  // FETCH ALL MOVEMENTS FUNCTION WITH CACHING
  async function getMovements() {
    if (movements.length > 0) {
      return movements; // Use cached movements if available
    }
    try {
      const fetchedMovements = await getAllMovements();
      console.log('Movements fetched:', fetchedMovements);
      setMovements(fetchedMovements.data);
    } catch (err) {
      console.error(err);
      return []; // Return an empty array in case of error
    }
  }

  // HANDLE PROGRAM CHANGES
  function handleProgramChange(e) {
    console.log(e.target.name)
    if (e.target.name === 'previous-program' && programIndex > 0) {
      setProgramIndex(programIndex - 1);
      setProgram(programList[programIndex - 1]);
      setWeek(1);
      setDay(1);
    }
    if (e.target.name === 'next-program' && programIndex < programList.length - 1) {
      setProgramIndex(programIndex + 1);
      setProgram(programList[programIndex + 1]);
      setWeek(1);
      setDay(1);
    }
    if (e.target.name === 'previous-week' && week > 1) {
      setWeek(week - 1);
    }
    if (e.target.name === 'next-week' && week < 6) {
      setWeek(week + 1);
    }  
    if (e.target.name === 'previous-day' && day > 1) {
      setDay(day - 1);
    }
    if (e.target.name === 'next-day' && day < 7) {
      setDay(day + 1);
    }
  }
  // verify session
  async function fetchUserSession() {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        return 
      } else {
        console.error('Session error:', data.error);
        return
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      return
    }
  }
  
  // HANDLE WORKOUT COMPLETION
  const handleWorkoutCompletion = async (formData) => {
    const userId = formData.get('userId');
    const workoutId = formData.get('workoutId');
    try {
      const response = await markWorkoutAsCompleted({userId, workoutId});
      if (!response.success) {
        throw new Error(response.message)
      }
      console.log('Workout marked as completed', 'YAY');
    } catch (error) {
      console.log('Error:', error.message);
    }
  };



  function checkIfWorkoutCompleted() {
    return user?.completed?.some(entry => entry.pillarId.toString() === workout?._id.toString())
  }


  // TRACK CHANGE IN WORKOUT
  useEffect(() => {
    const initPage = async () => {
      fetchUserSession();
      getMovements();
      getWorkout(programList[programIndex], week, day)
    }

    initPage();
    
  },[programIndex, week, day]);
  
  // useEffect(() => {
  //   getUser();
  // }, []);
  return (
    <>
      {/* PROFILE DETAILS */}
      <div className="bg-[rgba(0,0,0,0.3)] px-4 py-8 relative overflow-hidden">
          {user?.role==='admin' &&
          <Link href="/programs" className='w-max text-center text-white px-4 py-2 rounded-md duration-300 hover:text-gray-400 flex items-center gap-2 justify-center'>
            <span className="material-symbols-outlined">arrow_back</span>BACK
          </Link>}
        <Image src="/images/Vitinho.jpg" alt="idea icon" width={200} height={200} className="absolute top-[-25%] -z-10 left-0 w-full h-auto" />
        {workout ? (
          <>
            <h1 className="font-bold text-2xl text-white uppercase text-center">{workout.program}</h1>
            <h2 className="font-bold text-lg text-white uppercase text-center">
              Week {workout.week} | day {workout.day}
            </h2>
          </>
        ) : (
          <h1 className="font-bold text-2xl text-white uppercase">No workout found</h1>
        )}
      </div>


      {/* DATE AND PROGRAM SELECTION */}
      <div className="flex justify-center items-center gap-8 py-4 bg-black">
        <button type='button' onClick={handleProgramChange} name='previous-program' className='workout-button'>&lt;</button>
        <p className="uppercase text-white text-xl">{program}</p>
        <button type='button' onClick={handleProgramChange} name='next-program' className='workout-button'>&gt;</button>
      </div>
      <div className="flex gap-12 justify-center items-center bg-slate-400 py-2">
        <div>
          <div className="flex items-center gap-4 w-max">
            <button type='button' onClick={handleProgramChange} name='previous-week' className='workout-button'>&lt;</button>
            <p className="uppercase text-white text-xl">WEEK {week}</p>
            <button type='button' onClick={handleProgramChange} name='next-week' className='workout-button'>&gt;</button>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 w-max">
             <button type='button' onClick={handleProgramChange} name='previous-day' className='workout-button'>&lt;</button>
            <p className="uppercase text-white text-xl">DAY {day}</p>
            <button type='button' onClick={handleProgramChange} name='next-day' className='workout-button'>&gt;</button>
          </div>
        </div>
      </div>
      <form action={handleWorkoutCompletion}>
        <input type="hidden" name="userId" value={user?.id || ''} />
        <input type="hidden" name="workoutId" value={workout?._id || ''} />
        <p>{user.id}</p>
        {checkIfWorkoutCompleted(workout?._id) ? <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-8 mx-auto block"
        >
          ✅ Mark as Completed
        </button> : <p className=''>COMPLETED</p>}
      </form>

      {/* WORKOUT */}
      {workout ? (
        <div className="mt-4 mb-12">
          {workout.sections?.map((workoutSection, index) => (
            <div key={index}>
              <div className="w-full bg-black px-4 py-2 mt-8">
                <h3 className="text-white font-bold text-base flex items-center uppercase">
                  <Image src={ideaIcon} alt="icon" width={24} height={24} className="mr-2 upp" />
                  {workoutSection.section}
                </h3>
              </div>

              <div className="w-[90%] mx-auto mt-4 space-y-2">
                <p className="whitespace-pre-line">{workoutSection.description}</p>
              </div>

              {createVideoArray(movements, workoutSection.description).length > 0 && (
                <div className="w-[90%] mx-auto mt-4 space-y-2">
                  <h3>VIDEOS ({createVideoArray(movements, workoutSection.description).length}):</h3>
                  <div className="w-full mx-auto mt-2 space-y-2 flex gap-4 items-center overflow-auto">
                    {createVideoArray(movements, workoutSection.description).map((video, index) => (
                      <div key={index} className="flex flex-col">
                        <p className="text-xs font-bold">{video.name.toUpperCase()}</p>
                        <YouTubeEmbed videoid={getQueryValue(video.link)} width={400} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {workoutSection.notes && (
                <div className="w-[90%] mx-auto mt-4">
                  <h3>NOTES:</h3>
                  <p className="whitespace-pre-line text-sm">{workoutSection.notes}</p>
                </div>
              )}
            </div>
          ))}
         
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