import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/db';

export async function POST(
    req:NextRequest
  ) {
    try {
      const body = await req.json();
      const { email, name, isSeller, eoa } = body;

if (!email) {
  return new NextResponse("Email is required", { status: 400 });
}
if (!eoa) {
  return new NextResponse("EOA is required", { status: 404 });
}

const profile = await prismadb.user.create({
  data: {
    email,
    eoa,
    name,
    isSeller,
  },
});

      return NextResponse.json(profile.id);
    } catch (error) {
      console.log('so theadd     ', error);
      return new NextResponse("Internal error:   ", { status: 500 });
    }
  };
