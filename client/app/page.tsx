'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from "ethers";
import abi from "./ABIs/PerpsMain.json"
import type { InterfaceAbi } from "ethers";
import {useState, useEffect} from "react"
import { useAccount, useWalletClient } from 'wagmi';
import {getContract} from "viem"


const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
console.log("contract address", contractAddress, abi)

export default function Home() {

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [entryPrice, setEntryPrice] = useState("");
  const [collateral, setCollateral] = useState("");
  const [leverage, setLeverage] = useState("");
  const [isLong, setIsLong] = useState(true);
  const [currentPrice, setCurrentPrice] = useState("");
  const [pnl, setPnl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const contract = walletClient
  ? getContract({
      address: contractAddress as `0x${string}`,
      abi: abi.abi,
      client: walletClient,
    })
  : null;

  useEffect(() => {   
    setIsMounted(true);
  }, []);

  const getPosition = async () => {
    if (!contract || !address) return;

    const position = await contract.read.getPosition([address]);

    console.log("POSITION: ===========> ", position);
  };

  const openPosition = async () => {
  if (!contract) return;

  const tx = await contract.write.openingPosition([
    Number(entryPrice),
    Number(collateral),
    isLong,
    Number(leverage),
  ]);
  getPosition()
  console.log(tx);
};

  const liquidate = async () => {
    if (!contract) return;

    await contract.write.liquidate([address , Number(currentPrice)])
    console.log("position liquidated")
  }


  const getPnL = async () => {
    if (!contract) return;

    const result:any = await contract.read.getProfitNLoss([
      address,
      Number(currentPrice)]
    );

    setPnl(BigInt(result).toString());    
    console.log(BigInt(result).toString())
    getPosition()
  };

  const updatePrice = async () => {
    if (!contract) return;

    await contract.write.setPrice([Number(currentPrice)]);

    alert("Price updated!");
  };


  if (!isMounted) return null; // 🔥 FIX



  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col gap-6">
      <ConnectButton />

      {/* 🧠 OPEN POSITION */}
      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">Open Position</h2>

        <input
          placeholder="Entry Price"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          className="p-2 m-1 text-black"
        />

        <input
          placeholder="Collateral"
          value={collateral}
          onChange={(e) => setCollateral(e.target.value)}
          className="p-2 m-1 text-black"
        />

        <input
          placeholder="Leverage"
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
          className="p-2 m-1 text-black"
        />

        <div className="my-2">
          <button
            onClick={() => setIsLong(true)}
            className={`px-4 py-2 m-1 ${isLong ? "bg-green-500" : "bg-gray-700"}`}
          >
            Long
          </button>

          <button
            onClick={() => setIsLong(false)}
            className={`px-4 py-2 m-1 ${!isLong ? "bg-red-500" : "bg-gray-700"}`}
          >
            Short
          </button>
        </div>

        <button
          onClick={openPosition}
          className="bg-blue-500 px-4 py-2 mt-2"
        >
          Open Position
        </button>
      </div>

      {/* 📊 PRICE CONTROL */}
      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">Market Price</h2>

        <input
          placeholder="Current Price"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="p-2 m-1 text-black"
        />

        <button
          onClick={updatePrice}
          className="bg-yellow-500 px-4 py-2"
        >
          Update Price
        </button>
      </div>

      {/* 💰 PNL */}
      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">PnL</h2>

        <button
          onClick={getPnL}
          className="bg-purple-500 px-4 py-2"
        >
          Get PnL
        </button>

        {pnl && (
          <p className={`mt-2 ${Number(pnl) >= 0 ? "text-green-400" : "text-red-400"}`}>
            PnL: {pnl}
          </p>
        )}
      </div>

      {/* ⚠️ LIQUIDATION */}
      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">Liquidation</h2>

        <button
          onClick={liquidate}
          className="bg-red-600 px-4 py-2"
        >
          Liquidate Position
        </button>
      </div>

    </div>
  );
}
