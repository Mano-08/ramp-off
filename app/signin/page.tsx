'use client';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();

  const session = useSession();
  if (session?.data?.user) {
    redirect('/');
  }


  const handleLogin = async () => {
    await signIn('google');
    router.push("/crypto/register")
  };



  return (
    <div className="flex h-screen items-center justify-center bg-slate-300">
      <div className="w-96 rounded-md bg-white p-4 text-center">
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center rounded border-2 bg-gray-300 p-2 font-bold text-black hover:border-black"
        >
          <FcGoogle className="mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
}
