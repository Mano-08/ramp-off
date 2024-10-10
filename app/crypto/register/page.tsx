'use client'
import { useState,useCallback } from 'react'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast, ToastContainer } from 'react-toastify'
import { type Hex, formatEther, parseAbi, parseEther } from 'viem'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation';
import { writeContract } from '@wagmi/core'
import { switchChain } from 'wagmi/actions'
import { optimismSepolia, avalancheFuji, arbitrum, arbitrumSepolia } from 'wagmi/chains'
import { Config } from '@/app/rainbowprovider';
import {
	usePublicClient,
	useTransaction,
	useWalletClient,
} from "wagmi";
import {
  useAccount,
  type BaseError, useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";





export default function Component() {

  const [name, setName] = useState('')
  const [network, setNetwork] = useState('')
  const [isSeller, setIsSeller] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: walletClient } = useWalletClient();


  const { address } = useAccount();
  const { isConnected } = useAccount()
  const { data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed, data } =
  useWaitForTransactionReceipt({
    hash,
  })
  const { writeContract, isSuccess, data: writeContractData, status } = useWriteContract(); // create market

  const session = useSession();

  const router=useRouter()



  // const handleButtonClick = useCallback(() => {
  //   try {
  //     writeContract({
  //       abi: parseAbi(['function submitProposalOffRAMP(uint256 tradeId, uint256 tradeETH)']),
  //       address: "0x6057525fbEAd7eC2924B46885C570745a60c4126",
  //       functionName: 'submitProposalOffRAMP',
  //       args: [BigInt(1), BigInt((0.0002 * 1e18).toFixed())], // Properly converting to BigInt
  //     });
  //   } catch (error) {
  //     console.error("Error placing bet:", error);
  //   }
  // }, [writeContract]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    if (name && (isSeller ? network : true)) {
      setIsLoading(true)
      try {
        const response = await axios.post('/api/profile', {
            name,
            eoa: address,
            email: session?.data?.user?.email,
            isSeller: isSeller
          });
        toast.success('Registration successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        if (response.data.id) {
          router.push(`/${response.data.id}`); // Push to the user's profile page
        }
        console.log('API Response:', response.data)
      } catch (error) {
        toast.error('Registration failed. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        console.error('API Error:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error('Please fill out all required fields', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Crypto Registration</CardTitle>
          <CardDescription className="text-center">Register as a crypto buyer or seller</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="seller-mode"
                  checked={isSeller}
                  onCheckedChange={(checked) => {
                    setIsSeller(checked)
                    if (!checked) setNetwork('')
                  }}
                />
                <Label htmlFor="seller-mode">Register as a Seller</Label>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? 'Registering...' : `Register as ${isSeller ? 'Seller' : 'Buyer'}`}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center text-gray-500">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
      <ToastContainer />

    </div>
  )
}