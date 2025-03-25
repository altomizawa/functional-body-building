import Image from "next/image";
import Link from 'next/link';
import KOR__logo from '@/public/images/KOR_Somente_Red.svg';

export default function ProgramSelection() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <main className="flex flex-col gap-8 items-center sm:items-start w-[90%] md:w-3/4 lg:w-1/2">
      <Image src={KOR__logo} alt="logo" width={200} height={200} className="w-48 md:w-[240px] h-auto mx-auto" />
        <h1 className="text-4xl font-bold text-center sm:text-center w-full">FUNCTIONAL BODYBUILDING</h1>	
        <Link href="/dashboard/workouts" className='button__main-menu'>ADD WORKOUT</Link>
        <Link href="dashboard/movements" className='button__main-menu'>ADD EXERCISE</Link>
        <Link href="/programs" className='button__main-menu'>GO TO WORKOUTS</Link>
      </main>
    </div>
  );
}
