'use client'
import { pusherClient } from '@/lib/pusher';
import { FC, useEffect, useState } from 'react'

interface Message {
  id: string;
  text: string;
}

const Transactions: FC<{ initialMessages: Message[], roomId: string }> = ({ initialMessages, roomId }) => {
  const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);

  useEffect(() => {
    pusherClient.subscribe(roomId);

    pusherClient.bind('incoming-message', (message: Message) => {
      setIncomingMessages((prev) => [...prev, message]);
    });
  
    return () => {
      pusherClient.unsubscribe(roomId);
    };
  }, [roomId]);

  return (
    // <div>

    //   {initialMessages.map((message) => (
    //     <p key={message.id}>{message.text}</p>
    //   ))}
    //   {incomingMessages.map((message, i) => (
    //     <p key={message.id}>{message.text}</p>
    //   ))}
    // </div>

    <div className="w-full max-w-lg mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
  <div className="space-y-4">
    {initialMessages.map((message) => (
      <div key={message.id} className="p-4 bg-white rounded-lg shadow">
        <p className="text-gray-800">{message.text}</p>
      </div>
    ))}
    {incomingMessages.map((message) => (
      <div key={message.id} className="p-4 bg-blue-100 rounded-lg shadow">
        <p className="text-blue-800">{message.text}</p>
      </div>
    ))}
  </div>
</div>

  )
}

export default Transactions;
