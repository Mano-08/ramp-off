import prismadb from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { NextRequest } from 'next/server';

export async function POST(req:NextRequest) {
  const { text, roomId,email} = await req.json()
  pusherServer.trigger(roomId, 'incoming-message', text);
  const user=await prismadb.user.findUnique({
    where: {
      email: email
    },
    select:{
      isSeller:true
    }
  })

  const sellerOrBuyer = user?.isSeller;

  const message =await prismadb.sell.create({
    data: {
      text: text,
      gameRoomId: roomId,
    },
  })
  // Prepare the message payload including sellerOrBuyer
  const messageData = {
    id: message.id,
    text: message.text,
    sellerOrBuyer, // Append the sellerOrBuyer flag here
    createdAt: message.createdAt,
  };

  // return new Response(JSON.stringify(message));
  return new Response(JSON.stringify(messageData));
}