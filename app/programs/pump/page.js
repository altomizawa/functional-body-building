import { PROGRAM_LIST } from '@/lib/constants';
import { getUserById } from '@/lib/actions';
import { verifySessionForRequests } from '@/lib/session';
import { fetchWorkout } from '@/lib/workoutActions';
import { checkIfWorkoutCompleted } from '@/utils/utils';
import WorkoutNavigation from '@/components/workout/WorkoutNavigation';
import MarkCompleteWorkoutButton from '@/components/MarkCompleteWorkoutButton';
import WorkoutContainer from '@/components/workout/WorkoutContainer';
import VideosContainer from '@/components/workout/VideosContainer';
import SectionTitle from '@/components/workout/SectionTitle';
import SectionDescription from '@/components/workout/SectionDescription';
import React, { Suspense } from 'react';
import NotesContainer from '@/components/workout/NotesContainer';
import WorkoutComplete from '@/components/workout/WorkoutComplete';
import NoWorkoutFound from '@/components/workout/NoWorkoutFound';
import WorkoutHeader from '@/components/workout/WorkoutHeader';
import VideoContainer from '@/components/workout/Video';


async function Page({ searchParams }) {
  const params = await searchParams;
  let programParam = params?.program;
  let weekParam = params?.week;
  let dayParam = params?.day;

  const hasParams = programParam !== undefined && weekParam !== undefined && dayParam !== undefined;

  let program = hasParams ? Number(programParam) : undefined;
  let week = hasParams ? Number(weekParam) : undefined;
  let day = hasParams ? Number(dayParam) : undefined;
  let workout;

  // Verify session
  const session = await verifySessionForRequests();

  // Fetch user Data
  const userData = await getUserById(session?.user.id);

  // Fetch workout if searchParams is provided
  if (hasParams) {
    const progName = PROGRAM_LIST[program] || PROGRAM_LIST[0];
    const newWorkout = await fetchWorkout(progName, week, day, 'pump4x');
    workout = newWorkout?.data;
  }
  // Fetch next workout after latest completed if searchParams is empty
  else if (userData?.data?.completed?.length > 0) {
    const latestWorkout = userData.data.completed[userData.data.completed.length - 1];
    const latestProgram = PROGRAM_LIST.indexOf(latestWorkout.pillarId?.program);
    const latestWeek = latestWorkout.pillarId?.week;
    const latestDay = latestWorkout.pillarId?.day;

    let nextWorkout = await fetchWorkout(PROGRAM_LIST[latestProgram] || PROGRAM_LIST[0], latestWeek, latestDay + 1, 'pump4x');

    if (!nextWorkout?.data) {
      nextWorkout = await fetchWorkout(PROGRAM_LIST[latestProgram] || PROGRAM_LIST[0], latestWeek + 1, 1, 'pump4x');
    }

    if (!nextWorkout?.data && latestProgram + 1 < PROGRAM_LIST.length) {
      nextWorkout = await fetchWorkout(PROGRAM_LIST[latestProgram + 1], 1, 1, 'pump4x');
    }

    if (!nextWorkout?.data) {
      workout = latestWorkout.pillarId;
      program = latestProgram >= 0 ? latestProgram : 0;
      week = latestWeek;
      day = latestDay;
    } else {
      workout = nextWorkout.data;
      program = PROGRAM_LIST.indexOf(nextWorkout.data.program);
      week = nextWorkout.data.week;
      day = nextWorkout.data.day;
    }
  }

  // Fallback to first workout if searchParams empty and no user completed workouts
  if (!workout && !hasParams) {
    const firstWorkout = await fetchWorkout(PROGRAM_LIST[0], 1, 1, 'pump4x');
    workout = firstWorkout?.data;
    program = 0;
    week = 1;
    day = 1;
  }

  if (program === undefined || isNaN(program)) program = 0;
  if (week === undefined || isNaN(week)) week = 1;
  if (day === undefined || isNaN(day)) day = 1;

  // Check if workout is completed
  const isWorkoutCompleted = workout ? checkIfWorkoutCompleted(userData, workout) : false;

  return (
    <>
      <WorkoutHeader session={session} workout={workout} />

      <WorkoutNavigation program={program} week={week} day={day} />

      {/* Completion Form */}
      {isWorkoutCompleted && <WorkoutComplete />}

      {/* Workout Content */}
      <Suspense fallback={<div>Loading...</div>}>
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
            {!isWorkoutCompleted && workout._id && (
              <MarkCompleteWorkoutButton workoutId={workout._id.toString()} user={session.user} />
            )}
          </WorkoutContainer>
        ) : (
          <NoWorkoutFound />
        )}
      </Suspense>
    </>
  );
}

export default Page;
