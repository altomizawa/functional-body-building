import Image from "next/image";
import KOR__logo from '@/public/images/KOR_Somente_Red.svg';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import DashboardLink from '@/components/dashboard/DashboardLink';
import background from '@/public/images/bkg.jpg';

export default async function ProgramSelection() {
  const session = await verifySession(); // CHECK IF THERE'S A SESSION AND REDIRECT TO LOGIN IF NOT
  if (session?.role !== 'admin') {
    redirect('/programs/pillars')
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center z-0 bg-neutral-900/80">
      <Image src={background} alt="background" width={1920} height={1024} className="absolute inset-0 object-cover w-full h-full -z-10" />
      <div className='absolute top-8 lef-0 w-full'>
        <Image src={KOR__logo} alt="logo" width={200} height={200} className="w-16 md:w-[120px] h-auto mx-auto" />
        <h1 className="text-sm md:text-xl text-center">FUNCTIONAL BODYBUILDING</h1>
      </div>
      <DashboardContainer>
        <DashboardLink type='users'>USERS</DashboardLink>
        <DashboardLink type='addWorkout'>ADD WORKOUT</DashboardLink>
        <DashboardLink type='editWorkout'>EDIT WORKOUT</DashboardLink>
        <DashboardLink type='addExercise'>ADD EXERCISE</DashboardLink>
        <DashboardLink type='goToWorkouts'>GO TO WORKOUTS</DashboardLink>
      </DashboardContainer>
    </div>
  );
}
