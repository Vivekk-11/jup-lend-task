"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { CiWallet } from "react-icons/ci";

interface RepayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrowedAmount: number;
  borrowedToken: string;
  borrowedUSD: string;
  borrowTokenIcon: string;
  borrowTokenName: string;
}

export default function RepayModal({
  open,
  onOpenChange,
  borrowedAmount,
  borrowedToken,
  borrowedUSD,
  borrowTokenIcon,
  borrowTokenName,
}: RepayModalProps) {
  const [amount, setAmount] = useState("");
  const [healthPercentage, setHealthPercentage] = useState(69.91);

  const handleRepay = () => {
    console.log("Repaying:", amount);
    // Add repay logic here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B121A] border-[#19242e] text-white max-w-[640px] p-0">
        {/* Header */}
        <DialogHeader className="border-b border-[#19242e] p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Repay</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Balance Info */}
          <div>
            <div className="text-xs text-neutral-400 mb-1">Borrowed</div>
            <div className="text-lg font-semibold">
              {borrowedAmount} {borrowedToken}
            </div>
            <div className="text-xs text-neutral-400">{borrowedUSD}</div>
          </div>

          {/* Repay Input */}
          <div className="bg-[#0d1520] border border-[#19242e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-400">Repay</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 flex items-center gap-x-1">
                  <CiWallet />
                  <span>0.00 {borrowedToken}</span>
                </span>
                <button className="text-xs px-2 py-0.5 bg-[#19242e] rounded text-neutral-300 hover:bg-[#1f2937]">
                  HALF
                </button>
                <button className="text-xs px-2 py-0.5 bg-[#19242e] rounded text-neutral-300 hover:bg-[#1f2937]">
                  MAX
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={borrowTokenIcon}
                  alt={borrowTokenName}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="font-semibold">{borrowedToken}</span>
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-right text-3xl font-medium outline-none text-neutral-400 w-full"
              />
            </div>
          </div>

          {/* Health Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{healthPercentage}%</span>
              <span className="text-sm font-medium text-orange-400">Risky</span>
            </div>
            <div className="relative h-2 bg-[#1a2332] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#ffa500] to-[#ff6b6b] rounded-full"
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-neutral-500">Max: L.T. 80%</span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 text-sm text-neutral-400">
            <div className="w-4 h-4 rounded-full border border-neutral-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">i</span>
            </div>
            <p>
              If SOL reaches 116.48 USDC (drops by 12.98%), your position may be
              partially liquidated
            </p>
          </div>

          {/* Repay Button */}
          <button
            onClick={handleRepay}
            className="cursor-pointer w-full bg-[#c7f284] text-black font-semibold py-3.5 rounded-lg hover:bg-[#91B163] transition-colors"
          >
            Repay
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
