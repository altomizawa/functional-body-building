
import Image from 'next/image';
import { PROGRAM_LIST } from '@/lib/constants';
import { getUserById, getWorkoutById } from '@/lib/actions';
import { verifySessionForRequests } from '@/lib/session';
import ideaIcon from '@/public/icons/idea.svg';
import { YouTubeEmbed } from "@next/third-parties/google";
import Link from 'next/link';
import { markWorkoutAsCompleted, getLatestCompletedWorkout, fetchWorkout, getAllMovements } from '@/lib/actions';
import { getQueryValue, createVideoArray, isWorkoutCompleted } from '@/utils/utils';
import WorkoutNavigation from '@/components/WorkoutNavigation';
import MarkCompleteWorkoutButton from '@/components/MarkCompleteWorkoutButton';

async function Page({ searchParams  }) {
  let { program, week, day } = await searchParams
  let workout

  // Verify session
  const session = await verifySessionForRequests();
  
  // Fetch all movements
  const movements = await getAllMovements()
  
  
  // Fetch user Data
  const userData = await getUserById(session?.user.id);
  


  // Fetch latest workout if searchParams is empty
  if ((!program || !week || !day) && userData.data.completed.length > 0) {
    const latestWorkout = userData.data.completed[userData.data.completed.length - 1]
    workout = latestWorkout.pillarId;
    program = PROGRAM_LIST.indexOf(latestWorkout.pillarId.program);
    week = latestWorkout.pillarId.week;
    day = latestWorkout.pillarId.day;
    }
  // If user has no workouts AND searchParams is empty, fetch first workout
  if ((!program || !week || !day) && userData.data.completed.length === 0) {
    const firstWorkout = await fetchWorkout(PROGRAM_LIST[0], 1, 1)
    workout = firstWorkout.data;
    program = 0;
    week = 1;
    day = 1;
  }

  // Fetch workout if searchParams is not empty
  if(program && week && day) {
    const newWorkout = await fetchWorkout(PROGRAM_LIST[program], week, day)
    workout = newWorkout.data;
  }

  return (
    <>
      {/* Header */}
      <div className="bg-[rgba(0,0,0,0.3)] px-4 py-8 relative overflow-hidden">
        {session.user?.role === 'admin' && (
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

      <WorkoutNavigation program={program} week={week} day={day} />

      {/* Completion Form */}
      {isWorkoutCompleted(userData, workout) && <p className='bg-green-500 w-full text-white text-center p-2 font-bold'>WORKOUT DONE</p>}

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
              {movements && createVideoArray(movements, section.description).length > 0 && (
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
          {!isWorkoutCompleted() && <MarkCompleteWorkoutButton workout={workout} user={session.user} />}
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
