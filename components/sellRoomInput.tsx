"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import { type Hex, formatEther, parseAbi, parseEther } from "viem";
import { optimismSepolia, avalancheFuji } from "wagmi/chains";
import { readContract, writeContract } from "@wagmi/core";
import {
  useAccount,
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { waitForTransactionReceipt } from "viem/actions";
import EmailBody from "./EmailBody";

const SellRoomInput = ({
  roomId,
  tradeId,
  pushMessage,
  newMessage,
  setNewMessage,
}: any) => {
  const [userRole, setUserRole] = useState<boolean | null>(null); // true = seller, false = buyer
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");
  const [inputValue4, setInputValue4] = useState("");
  const [inputValue5, setInputValue5] = useState("");

  const router = useRouter();
  const session = useSession();

  const { address } = useAccount();
  const { isConnected } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  async function setRole() {
    console.log(session?.data?.user?.email);
    const response = await axios.post("/api/sellerroom", {
      text: "",
      roomId,
      email: session?.data?.user?.email,
    });
    const data = await response.data;
    setUserRole(data.sellerOrBuyer); // Set user role based on response
  }

  useEffect(() => {
    setRole();
  }, []);

  async function handleContract(
    address: any,
    abi: any,
    functionName: string,
    args: any[]
  ): Promise<void> {
    try {
      let result = writeContract({
        address,
        abi,
        functionName,
        args,
      });
    } catch (error) {
      console.error("Error executing contract function:", error);
    }
  }

  const sendMessage = async (text: string) => {
    pushMessage(text);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    pushMessage(newMessage);
    setNewMessage("");
  }

  return (
    <main className="min-h-screen w-1/2 flex flex-row">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="w-full rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-neutral-100"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="rounded-full bg-black hover:bg-neutral-900"
        >
          <SendButton />
        </button>
      </form>

      {isConnected && userRole === true && (
        <>
          <div>
            <Input
              className="w-full"
              placeholder="enter how many eth value want to sell"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div>
            <Input
              className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Send each other messages to complete the trade"
              type="number"
              step="any" // Allows for any decimal number
              value={inputValue4}
              onChange={(e) => setInputValue4(e.target.value)}
            />
            <Button
              disabled={isPending}
              className="w-full"
              onClick={() => {
                writeContract({
                  address: "0x6057525fbEAd7eC2924B46885C570745a60c4126",
                  abi: parseAbi([
                    "function submitProposalOffRAMP(uint256 tradeId,uint256 tradeETH)",
                  ]),
                  functionName: "submitProposalOffRAMP",
                  args: [
                    BigInt(14),
                    BigInt((Number(inputValue4) * 1e18).toFixed()),
                  ],
                  //@ts-ignore
                  value: parseEther(inputValue4),
                });
              }}
            >
              {isPending ? "Sending..." : "Submit Proposal"}
            </Button>
            <div className="min-h-32 mt-4">
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && (
                <div>
                  Transaction confirmed - Send to your Buyer
                  <button
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    onClick={() =>
                      sendMessage(
                        `Tnx confirmed successfullySent-> https://sepolia.arbiscan.io/tx/${hash}`
                      )
                    }
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <Button
              disabled={isPending}
              className="w-full"
              onClick={() => {
                const ethAmount = parseFloat(inputValue);
                if (!isNaN(ethAmount)) {
                  handleContract(
                    "0x6057525fbEAd7eC2924B46885C570745a60c4126",
                    parseAbi(["function startRound(uint256 tradeId)"]),
                    "startRound",
                    [tradeId]
                  );
                } else {
                  console.error(" something went wrong");
                }
              }}
            >
              {isPending ? "Locking..." : "locking your ETH"}
            </Button>
            <div className="min-h-32 mt-4">
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && (
                <div>
                  Transaction confirmed - Send to your Buyer
                  <button
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    onClick={() =>
                      sendMessage(
                        `Tnx confirmed locked ETH successfully Sent-> https://sepolia.arbiscan.io/tx/${hash}`
                      )
                    }
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div>
        {isConnected && userRole === false && (
          <>
            <div>
              <Input
                className="w-full"
                placeholder="Anything want to say to seller via attestation"
                value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}
              />
            </div>
            <div>
              <Button
                disabled={isPending}
                className="w-full"
                onClick={() => {
                  const ethAmount = parseFloat(inputValue);
                  if (!isNaN(ethAmount)) {
                    handleContract(
                      "0x6057525fbEAd7eC2924B46885C570745a60c4126",
                      parseAbi([
                        "function confirmOffRamp(address sellerAddress, uint256 tradeId,bytes memory _data)",
                      ]),
                      "confirmOffRamp",
                      [
                        "0x8a0d290b2ee35efde47810ca8ff057e109e4190b",
                        13,
                        inputValue2,
                      ]
                    );
                  } else {
                    console.error("error ");
                  }
                }}
              >
                {isPending ? "Sending..." : "Accept Proposal"}
              </Button>
              <div className="min-h-32 mt-4">
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && (
                  <div>
                    Transaction confirmed - Send to your Seller
                    <button
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      onClick={() =>
                        sendMessage(
                          `Tnx confirmed successfullySent-> https://sepolia.arbiscan.io/tx/${hash}`
                        )
                      }
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <EmailBody />
              <Button
                disabled={isPending}
                className="w-full"
                onClick={() => {
                  const ethAmount = parseFloat(inputValue);
                  if (!isNaN(ethAmount)) {
                    handleContract(
                      "0x6057525fbEAd7eC2924B46885C570745a60c4126",
                      parseAbi([
                        "function sendRequest( uint256 tradeId, uint64 subscriptionId, string[] calldata args)",
                      ]),
                      "sendRequest",
                      [tradeId, 166, ["accesstoken", "messageId"]]
                    );
                  } else {
                    console.error("error ");
                  }
                }}
              >
                {isPending ? "Sending to Oracle..." : "confirming Request"}
              </Button>
              <div className="min-h-32 mt-4">
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && (
                  <div>
                    Transaction confirmed - Send to your Seller
                    <button
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      onClick={() =>
                        sendMessage(
                          `Tnx confirmed successfully paid to seller, Sent-> https://sepolia.arbiscan.io/tx/${hash}`
                        )
                      }
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Button
                disabled={isPending}
                className="w-full"
                onClick={() => {
                  const ethAmount = parseFloat(inputValue);
                  if (!isNaN(ethAmount)) {
                    handleContract(
                      "0x6057525fbEAd7eC2924B46885C570745a60c4126",
                      parseAbi(["function claim( uint256 tradeId)"]),
                      "claim",
                      [tradeId]
                    );
                  } else {
                    console.error("error you are not authroized to claim");
                  }
                }}
              >
                {isPending ? "claiming ETH ..." : "claim your ETH"}
              </Button>
              <div className="min-h-32 mt-4">
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && (
                  <div>
                    Transaction confirmed - Send to your Seller
                    <button
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      onClick={() =>
                        sendMessage(
                          `Tnx confirmed successfully paid to seller, Sent-> https://sepolia.arbiscan.io/tx/${hash}`
                        )
                      }
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

function SendButton() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  );
}

export default SellRoomInput;
