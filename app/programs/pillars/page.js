import { PROGRAM_LIST } from '@/lib/constants';
import { getUserById} from '@/lib/actions';
import { verifySessionForRequests } from '@/lib/session';
import { fetchWorkout, getAllMovements } from '@/lib/actions';
import { checkIfWorkoutCompleted } from '@/utils/utils';
import WorkoutNavigation from '@/components/workout/WorkoutNavigation';
import MarkCompleteWorkoutButton from '@/components/MarkCompleteWorkoutButton';
import WorkoutContainer from '@/components/workout/WorkoutContainer';
import VideosContainer from '@/components/workout/VideosContainer';
import SectionTitle from '@/components/workout/SectionTitle';
import SectionDescription from '@/components/workout/SectionDescription';
import React from 'react';
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

  // Check if workout is completed
  const isWorkoutCompleted = checkIfWorkoutCompleted(userData, workout);


  return (
    <>
      {/* Header */}
      <WorkoutHeader session={session} workout={workout} />

      <WorkoutNavigation program={program} week={week} day={day} />

      {/* Completion Form */}
      {isWorkoutCompleted && <WorkoutComplete />}

      {/* Workout Content */}
      {workout ? (
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
      ) : (
        <NoWorkoutFound />
      )}      
    </>
  );
}

export default Page;
