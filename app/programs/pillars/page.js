import { PROGRAM_LIST } from '@/lib/constants';
import { getUserById} from '@/lib/actions';
import { verifySessionForRequests } from '@/lib/session';
import { fetchWorkout } from '@/lib/workoutActions';
import { checkIfWorkoutCompleted } from '@/utils/utils';
import WorkoutNavigation from '@/components/workout/WorkoutNavigation';
import MarkCompleteWorkoutButton from '@/components/MarkCompleteWorkoutButton';
import WorkoutContainer from '@/components/workout/WorkoutContainer';
import VideosContainer from '@/components/workout/VideosContainer';
import SectionTitle from '@/components/workout/SectionTitle';
import SectionDescription from '@/components/workout/SectionDescription';
import React , {Suspense, use} from 'react';
import NotesContainer from '@/components/workout/NotesContainer';
import WorkoutComplete from '@/components/workout/WorkoutComplete';
import NoWorkoutFound from '@/components/workout/NoWorkoutFound';
import WorkoutHeader from '@/components/workout/WorkoutHeader';
import VideoContainer from '@/components/workout/Video';


async function Page({ searchParams  }) {
  let { program, week, day } = await searchParams
  let workout

  // Verify session
  const session = await verifySessionForRequests();
  
  // Fetch user Data
  const userData = await getUserById(session?.user.id);
  

  // Fetch next workout after latest completed if searchParams is empty
  if ((!program || !week || !day) && userData.data.completed.length > 0) {
    const latestWorkout = userData.data.completed[userData.data.completed.length - 1]
    const latestProgram = PROGRAM_LIST.indexOf(latestWorkout.pillarId.program);
    const latestWeek = latestWorkout.pillarId.week;
    const latestDay = latestWorkout.pillarId.day;
    
    // Try to fetch next day
    let nextWorkout = await fetchWorkout(PROGRAM_LIST[latestProgram], latestWeek, latestDay + 1);
    
    // If next day doesn't exist, try next week day 1
    if (!nextWorkout.data) {
      nextWorkout = await fetchWorkout(PROGRAM_LIST[latestProgram], latestWeek + 1, 1);
    }
    
    // If next week doesn't exist, try next program week 1 day 1
    if (!nextWorkout.data && latestProgram + 1 < PROGRAM_LIST.length) {
      nextWorkout = await fetchWorkout(PROGRAM_LIST[latestProgram + 1], 1, 1);
    }
    
    // If still no workout, fallback to latest completed
    if (!nextWorkout.data) {
      workout = latestWorkout.pillarId;
      program = latestProgram;
      week = latestWeek;
      day = latestDay;
    } else {
      workout = nextWorkout.data;
      program = PROGRAM_LIST.indexOf(nextWorkout.data.program);
      week = nextWorkout.data.week;
      day = nextWorkout.data.day;
    }
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

  // Check if workout is completed
  const isWorkoutCompleted = checkIfWorkoutCompleted(userData, workout);


  return (
    <>
      <WorkoutHeader session={session} workout={workout} />

      <WorkoutNavigation program={program} week={week} day={day} />

      {/* Completion Form */}
      {isWorkoutCompleted && <WorkoutComplete />}

      {/* Workout Content */}
      <Suspense fallback={<div>Loading...</div>}>
        <WorkoutContainer>
          {/* SECTIONS */}
          {workout.sections?.map((section, index) => (
            <React.Fragment key={index}>
              {/* TITLE */}
              <SectionTitle title={section.section} />

              {/* Description */}
              <SectionDescription description={section.description} />

              {/* Videos */}
              {section.movements && section.movements.length > 0 && (
                <VideosContainer numberOfVideos={section.movements.length}>
                    {section.movements.map((video, idx) => (
                      <VideoContainer key={idx} idx={idx} video={video} />
                    ))}
                </VideosContainer>
              )}

              {/* Notes */}
              {section.notes && (
                <NotesContainer notes={section.notes} />
              )}
            </React.Fragment>
          ))}
          {/* COMPLETE BUTTON */}
          {!isWorkoutCompleted && <MarkCompleteWorkoutButton workoutId={workout._id.toString()} user={session.user} />}
        </WorkoutContainer>   
        </Suspense>
    </>
  );
}

export default Page;
