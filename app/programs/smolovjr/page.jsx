import WorkoutHeader from "@/components/workout/WorkoutHeader"
import { verifySessionForRequests } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import WorkoutContainer from "@/components/smolovjr/WorkoutContainer";

export default async function SmolovJrPage() {

  // Fetch user Data
  // Verify session
  const session = await verifySessionForRequests();
  if (!session) {
    redirect('/login');
  }
  const userData = session?.user?.id ? await getUserById(session.user.id) : null;
  console.log('userData : ', userData)
  const oneRepMax = 250
  const days = [
    {
      id: 1,
      day: 'Day 1',
      sets: '6',
      reps: '6',
      weight: oneRepMax * 0.70,
      completedDate: '18/10/2026'
    },
    {
      id: 2,
      day: 'Day 2',
      sets: '7',
      reps: '5',
      weight: oneRepMax * 0.75,
      completedDate: '18/10/2026',
    },
    {
      id: 3,
      day: 'Day 3',
      sets: '8',
      reps: '4',
      weight: oneRepMax * 0.80,
      completedDate: '18/10/2026'
    },
    {
      id: 4,
      day: 'Day 4',
      sets: '9',
      reps: '3',
      weight: oneRepMax * 0.85,
      completedDate: '18/10/2026'
    },
    {
      id: 5,
      day: 'Day 5',
      sets: '6',
      reps: '6',
      weight: oneRepMax * 0.70,
      completedDate: '18/10/2026'
    },
    {
      id: 6,
      day: 'Day 6',
      sets: '7',
      reps: '5',
      weight: oneRepMax * 0.75,
      completedDate: '',
    },
    {
      id: 7,
      day: 'Day 7',
      sets: '8',
      reps: '4',
      weight: oneRepMax * 0.80,
      completedDate: '18/10/2026'
    },
    {
      id: 8,
      day: 'Day 8',
      sets: '9',
      reps: '3',
      weight: oneRepMax * 0.85,
      completedDate: '18/10/2026'
    },
    {
      id: 9,
      day: 'Day 9',
      sets: '6',
      reps: '6',
      weight: oneRepMax * 0.70,
      completedDate: '18/10/2026'
    },
    {
      id: 10,
      day: 'Day 10',
      sets: '7',
      reps: '5',
      weight: oneRepMax * 0.75,
      completedDate: '',
    },
    {
      id: 11,
      day: 'Day 11',
      sets: '8',
      reps: '4',
      weight: oneRepMax * 0.80,
      completedDate: '18/10/2026'
    },
    {
      id: 12,
      day: 'Day 12',
      sets: '9',
      reps: '3',
      weight: oneRepMax * 0.85,
      completedDate: '18/10/2026'
    },
  ]
  return (
    <div>
      <WorkoutHeader session={session} />
      <main className='flex flex-col gap-12 items-center justify-center'>
        <div className='flex gap-4'>
          <Button variant="outline">Bench Press</Button>
          <Button variant="outline">Back Squat</Button>
        </div>
        <div className='text-center border-b border-white w-full'>
          <h2 className='text-3xl pb-2'>1RM: 250 </h2>
        </div>
        <WorkoutContainer data={days} />
      </main>
    </div>
  )
} 