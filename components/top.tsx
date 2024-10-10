import { signOut } from 'next-auth/react';

export function Top({
  img,
  name,
  email,
}: {
  img?: string;
  name: string;
  email: string;
}) {
  return (
    <div className="mt-8 flex justify-evenly">
      <div className="flex items-center">
        <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
          <img
            src={img}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-bold">{name}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>
      <button onClick={() => signOut()} className="font-bold text-black">
        Log out
      </button>
    </div>
  );
}
