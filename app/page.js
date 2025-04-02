import Image from "next/image";
import Link from 'next/link';
import KOR__logo from '@/public/images/KOR_Somente_Red.svg';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { use } from 'react';

export default async function ProgramSelection() {
  const session = await verifySession(); // CHECK IF THERE'S A SESSION AND REDIRECT TO LOGIN IF NOT
  if (session?.role !== 'admin') {
    redirect('/programs/pillars')
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center z-0">
      <div className='absolute top-8 lef-0 w-full -z-10'>
        <Image src={KOR__logo} alt="logo" width={200} height={200} className="w-16 md:w-[120px] h-auto mx-auto" />
        <h1 className="text-sm md:text-xl text-center">FUNCTIONAL BODYBUILDING</h1>
      </div>
      <main className="flex flex-col gap-8 items-center sm:items-start w-[90%] md:w-3/4 lg:w-1/2">
        {session.role !=='user' && <Link href="/dashboard/workouts" className='button__main-menu'>ADD WORKOUT</Link>}
        {session.role !== 'user' && <Link href="dashboard/movements" className='button__main-menu'>ADD EXERCISE</Link>}
        <Link href="/programs" className='button__main-menu'>GO TO WORKOUTS</Link>
      </main>
    </div>
  );
}
