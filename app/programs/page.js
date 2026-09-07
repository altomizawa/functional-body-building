import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifySessionForRequests } from '@/lib/session'
import { getUserById } from '@/lib/actions'

const programs = async () => {
  // Verify session
  const session = await verifySessionForRequests();
  if (!session) {
    redirect('/login');
  }

  console.log('session : ', session)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">CHOOSE YOUR PROGRAM</h1>
        <div className='w-full flex flex-col gap-4'>
          <Link href="/programs/pillars" className='button__main-menu bg-white'>PILLARS</Link>
          <Link href="/programs/pump" className='button__main-menu bg-white'>PUMP 4x</Link>
          {session.user.role === 'admin' && <Link href="/" className='button__back flex items-center gap-2 justify-center'>
            <span className="material-symbols-outlined">arrow_back</span>BACK
          </Link>}
        </div>
      </main>
    </div>
  )
}

export default programs
