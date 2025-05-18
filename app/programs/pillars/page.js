
import Image from 'next/image';
import { PROGRAM_LIST } from '@/lib/constants';
import { verifySessionForRequests } from '@/lib/session';
import { getUserById, fetchWorkout, getAllMovements } from '@/lib/actions';

import { checkIfWorkoutCompleted } from '@/utils/utils';

import WorkoutPage from './WorkoutPage';


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
      <WorkoutPage 
        session={session}
        workout={workout}
        movements={movements}
        program={program}
        week={week}
        day={day}
        isWorkoutCompleted={isWorkoutCompleted} />
    </>
  );
}

export default Page;
