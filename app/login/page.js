import { SigninForm } from '@/components/SigninForm'
import Image from 'next/image'
import KOR__logo from '@/public/images/KOR_Somente_Red.svg'


const Signin = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
                <Image src={KOR__logo} alt="logo" width={200} height={200} className="w-48 md:w-[240px] h-auto mx-auto" />
          
          <h1 className="text-3xl font-bold">WELCOME TO KOR FBB</h1>
          <p className="text-muted-foreground mt-2">Enter your information to get started</p>
        </div>
        <SigninForm />
      </div>
    </main>
  )
}

export default Signin
