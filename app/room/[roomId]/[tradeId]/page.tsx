import Transactions from '@/components/Transactions';
// import SellRoomInput from '@/components/SellRoomInput';
import SellRoomInput from '@/components/sellRoomInput';
import prismadb from '@/lib/db';
import dynamic from 'next/dynamic';


interface PageParams {
  params: {
    roomId: string;
    tradeId: number; // Include tradeId in the params
  };
  }

export default async function page({params}:PageParams) {
      const {roomId,tradeId}=params;

const existingMessages = await prismadb.sell.findMany({
    where: {
      gameRoomId: roomId,
    },
  })


  const serializedMessages = existingMessages.map((message:any) => ({
    text: message.text,
    id: message.id,
  }))

return (
    <div>
<SellRoomInput roomId={roomId} tradeId={tradeId} />
<Transactions roomId={roomId} initialMessages={serializedMessages} />
    </div>
  )
}
