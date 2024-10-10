"use client";

import SellRoomChat from "@/components/SellRoomChat";
import Transactions from "@/components/Transactions";
// import SellRoomInput from '@/components/SellRoomInput';
import SellRoomInput from "@/components/sellRoomInput";
import { db } from "@/lib/firebase"; // Ensure you have the correct Firestore instance
import axios from "axios";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

interface PageParams {
  params: {
    roomId: string;
    tradeId: number; // Include tradeId in the params
  };
}

export default function page({ params }: PageParams) {
  const { roomId, tradeId } = params;

  const session: any = useSession();
  const [newMessage, setNewMessage] = useState<string>("");

  const messagesRef = collection(db, "messages");

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("roomId", "==", roomId),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  async function pushMessage(text: string) {
    if (text === "") return;
    let email = "";
    while (session?.data?.user?.email === undefined) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    email = session?.data?.user?.email;
    await addDoc(messagesRef, {
      text,
      createdAt: serverTimestamp(),
      email,
      roomId,
    });

    setNewMessage("");
  }

  return (
    <SellRoomChat
      setNewMessage={setNewMessage}
      newMessage={newMessage}
      messages={messages}
      pushMessage={pushMessage}
    />
  );
}
