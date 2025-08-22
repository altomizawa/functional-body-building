import { SigninForm } from '@/components/SigninForm'
import Image from 'next/image'
import KOR__logo from '@/public/logo_white.png';
import SigninForm2FA from '@/components/SignInForm2FA'

const Signin = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className='absolute top-8 lef-0 w-full'>
        <Image src={KOR__logo} alt="logo" width={200} height={200} className="w-16 md:w-[120px] h-auto mx-auto" />
        <h1 className="text-sm md:text-xl text-center">FUNCTIONAL BODYBUILDING</h1>
      </div>
      <div className="w-full max-w-md">
        <SigninForm2FA />
      </div>
    </main>
  )
}

export default Signin
