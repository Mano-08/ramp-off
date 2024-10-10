
'use client'
import { useRouter } from 'next/navigation'; 
interface PageParams {
  params: {
    profile: string;
  };
}
import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  createdAt: string;
  name:string,
  eoa: string;
  email: string;
}


export default function page({ params }: PageParams) {
  const router=useRouter()

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get('/api/buyers');
            const data=await response.data;
            setUsers(response.data);
          } catch (err) {
            setError('Failed to fetch users');
          } finally {
            setLoading(false);
          }
        };
      
        fetchUsers();
      }, []);
      
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    

        const handleProposal=async(userId:string)=>{
        const response = await axios.post(`/api/${params.profile}/sell`,{
            sellerId: userId
        });
        console.log('res',response.data)
      
  const incrementResponse = await axios.post("http://localhost:4000/api/increment")
  const tradeId=await incrementResponse.data.newRoomId;
       const roomId=response.data;
        router.push(`/crypto/room/${roomId}/${tradeId}`)
}

  const { profile } = params;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return(
  <div className="container mx-auto py-8">
  <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {users.map((user) => (
      <div key={user.id} className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{user.email}</h2>
        <p className="text-gray-700">Name: {user.name}</p>
        <p className="text-gray-700">EOA: {user.eoa}</p>
        <p className="text-gray-500 text-sm">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        <button
          onClick={() => handleProposal(user.id)} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Meet 
        </button>
      </div>
    ))}
  </div>

</div>
  )
}