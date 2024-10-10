import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/db';
interface PageParams {
    params: {
      profile: string;
    };
  }

export async function POST(req:NextRequest,{params}:PageParams) {
  try {
    const body = await req.json();
    const { sellerId } = body;
    const { profile} = params;
    const createdRoom = await prismadb.sellerRoom.create({
      data: {
        player1Id:profile,
        player2Id:sellerId
      }
    });
    console.log(createdRoom.id);
    return new Response(createdRoom.id);
  } catch (error) {
    console.error('While creating room 1:', error);
    return new Response('Internal room  Server Error', { status: 500 });
  }
}




