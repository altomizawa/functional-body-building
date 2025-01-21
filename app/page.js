import Image from "next/image";
import Link from 'next/link';

export default function ProgramSelection() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">main</h1>	
        <Link href="/programs" className='bg-black text-white px-4 py-2 rounded-md'>GO TO PROGRAMS</Link>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">footer</p>
      </footer>
    </div>
  );
}
