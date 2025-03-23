import Link from 'next/link'

const programs = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">CHOOSE YOUR PROGRAM</h1>
        <div className='w-full flex flex-col gap-4'>
          <Link href="/programs/pillars" className='bg-black text-white text-center px-4 py-2 rounded-md hover:bg-gray-400 duration-300'>PILLARS</Link>
          <Link href="/programs/12weeks" className='bg-black text-white text-center px-4 py-2 rounded-md hover:bg-gray-400 duration-300'>12 WEEK PROGRAM</Link>
        0
        </div>	
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">footer</p>
      </footer>
    </div>
  )
}

export default programs
