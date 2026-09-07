import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions';
import { verifySessionForRequests } from '@/lib/session';
import { getPumpWorkout } from '@/lib/workoutActions';
import { checkIfWorkoutCompleted } from '@/utils/utils';
import PumpWorkoutNavigation from '@/components/workout/PumpWorkoutNavigation';
import MarkCompleteWorkoutButton from '@/components/workout/MarkCompleteWorkoutButton';
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
  const dateParam = params?.date;

  // Verify session
  const session = await verifySessionForRequests();
  if (!session) {
    redirect('/login');
  }

  // Fetch user Data
  const userData = session?.user?.id ? await getUserById(session.user.id) : null;

  // Fetch workout by date (or latest if no date specified)
  const workoutResponse = await getPumpWorkout({
    date: dateParam,
    fallbackToLatest: !dateParam,
  });

  const workout = workoutResponse?.data;

  // Determine active date string for navigation
  let activeDate = dateParam;
  if (!activeDate && workout?.date) {
    activeDate = workout.date.split('T')[0];
  }

  // Check if workout is completed
  const isWorkoutCompleted = workout ? checkIfWorkoutCompleted(userData, workout) : false;

  return (
    <>
      <WorkoutHeader session={session} workout={workout} />

      <PumpWorkoutNavigation selectedDate={activeDate} workout={workout} />

      {/* Completion Banner */}
      {isWorkoutCompleted && <WorkoutComplete />}

      {/* Workout Content */}
      <Suspense fallback={<div className="p-8 text-center text-neutral-400">Loading workout...</div>}>
        {workout ? (
          <WorkoutContainer>
            {/* SECTIONS */}
            {workout.sections?.map((section, index) => (
              <React.Fragment key={section._id || index}>
                {/* Section Title */}
                <SectionTitle title={section.section} />

                {/* Section Description */}
                {section.description && (
                  <SectionDescription description={section.description} />
                )}

                {/* Section Videos / Movements */}
                {section.movements && section.movements.length > 0 && (
                  <VideosContainer numberOfVideos={section.movements.length}>
                    {section.movements.map((video, idx) => (
                      <VideoContainer key={video._id || idx} idx={idx} video={video} />
                    ))}
                  </VideosContainer>
                )}

                {/* Section Notes */}
                {section.notes && (
                  <NotesContainer notes={section.notes} />
                )}
              </React.Fragment>
            ))}

            {/* Complete Workout Button */}
            {!isWorkoutCompleted && workout._id && session?.user && (
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
