import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/db";
export async function GET(req:NextRequest,res:NextResponse) {
  try {

    const users = await prismadb.user.findMany({
        where: {
          isSeller: false
        },
        orderBy: {
          createdAt: 'desc', // You can adjust this to order by other fields
        },
        select: {
          id: true,
          createdAt: true,
          eoa: true,
          email: true,
          name:true
        }
      });
      console.log(users, 'helo bhai '  )
      return NextResponse.json(users);
    // return users;
  } catch (error) {
    console.error('error', error);
    return new Response('Internal room  Server Error', { status: 500 });
  }
}
