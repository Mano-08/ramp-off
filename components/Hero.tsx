'use client';
import { EmailCard } from '@/components/email';
import { Top } from '@/components/top';
import { emailDataBody, modifyDataBody } from '@/lib/data';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button } from "@/components/ui/button"
import Link from 'next/link';

export default function Hero() {
  
  const [selectedNumber, setSelectedNumber] = useState(5); 
  const [loading, setLoading] = useState(false);
  const [lodaingtext, setLoadingtext] = useState(''); 
  const [emailData, setEmailData] = useState([emailDataBody]); 
  const [modifyData, setModifyData] = useState([modifyDataBody]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumber(parseInt(event.target.value, 10));
  };

  const session: any = useSession();

  // if (!session?.data?.user) {
  //   redirect('/signin');
  // }
  // useEffect(() => {
  //   async function getData() {
  //     setLoading(true);
  //     setLoadingtext('Fetching Your Emails...');
  //     try {
  //       const res = await axios.get(`/api/gmail?count=${selectedNumber}`);
  //       if (res.status === 200) {
  //         setEmailData(res.data);
  //         setLoading(false);
  //       } else {
  //         setLoading(false);
  //         throw new Error('Failed to fetch data');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setEmailData([
  //         {
  //           snippet: 'Error fetching the emails',
  //           payload: {
  //             headers: [{ name: '', value: '' }],
  //             body: { data: '' },
  //             parts: [{ mimeType: '', body: { data: '' } }],
  //           },
  //         },
  //       ]);

  //       signOut();
  //       redirect('signin/');
  //     }
  //   }
  //   getData();
  // }, [selectedNumber]);

  // const [emailType, setEmailType] = useState([]);

  // if (typeof window !== undefined) {
  //   var apikey = localStorage.getItem('apiKey');
  // }

  // useEffect(() => {
  //   setModifyData(
  //     emailData.map((item) => {
  //       return {
  //         msg: item.snippet,
  //         category: '',
  //         from:
  //           item.payload.headers
  //             .find((header) => header.name === 'From')
  //             ?.value.split('<')[0]
  //             .trim() || '',

  //         fullMsg:
  //           item.payload?.parts?.find((part) => part.mimeType === 'text/html')
  //             ?.body?.data || item.payload.body.data,

  //         plaintext:
  //           item.payload.parts?.find((part) => part.mimeType === 'text/plain')
  //             ?.body?.data || '',
  //       };
  //     }),
  //   );
  // }, [emailData]);

  return (
       <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            P2P Crypto Exchange Platform
          </h1>
          <p className="text-xl text-white mb-8">
            Buy crypto with fiat, sell for instant cash. Secure, fast, and decentralized.
          </p>
          <div className="space-x-4">
            {/* <Link href="/buy" className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">
              Become Seller
            </Link> */}
            <Link href="/signin" className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">Login</Link>
            <Link href="/crypto/register" className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">
              Sell Crypto
            </Link>
          </div>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Smart Contract Escrow"
            description="Secure transactions with automated smart contract escrow."
          />
          <FeatureCard
            title="Instant Fiat Payments"
            description="Receive fiat payments directly to your bank account."
          />
          <FeatureCard
            title="Multiple Cryptocurrencies"
            description="Support for a wide range of popular cryptocurrencies."
          />
        </div>
      </div>
    </div>

  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-purple-600 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}