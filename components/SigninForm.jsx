'use client';

import { useState, useActionState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { signinUserAction } from '@/lib/auth';
import Link from 'next/link';

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(signinUserAction, {
    success: false,
    error: null,
  });
  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      router.push('/');
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 bg-white shadow-md rounded-md">
      <div className="space-y-4 p-4 rounded-md">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            placeholder="john.doe@email.com"
            required
          />
        </label>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          Password
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            autoComplete="current-password"
            className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            placeholder="*************"
            required
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
            className="underline text-sm"
          >
            show password
          </button>
        </label>
        <button
          type="submit"
          className="w-full border-2 py-2 rounded-md bg-black text-white hover:bg-gray-500"
        >
          {isPending ? 'Loading...' : 'Let me in'}
        </button>
        {!state?.success && <p className="text-red-500 text-sm">{state?.error}</p>}
        {!state?.success && state?.error === 'Email or password is incorrect' && <Link href='/forgot-password' className="text-red-500 text-sm underline">Forgot your password?</Link>}
        
        <div className="flex justify-center p-4 ">
          <div className="text-sm text-muted-foreground">
            Not registered yet?{" "}
            <Link href="/signup" className="underline underline-offset-4 text-black hover:text-primary">
              Sign up
            </Link>
          </div>
      </div>
      </div>
    </form>
  );
}
