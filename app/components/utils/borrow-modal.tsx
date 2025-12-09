"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CiWallet } from "react-icons/ci";

interface BorrowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliedAmount: number;
  suppliedToken: string;
  suppliedUSD: string;
  borrowedAmount: number;
  borrowedToken: string;
  borrowedUSD: string;
  borrowTokenIcon: string;
  borrowTokenName: string;
}

export default function BorrowModal({
  open,
  onOpenChange,
  suppliedAmount,
  suppliedToken,
  suppliedUSD,
  borrowedAmount,
  borrowedToken,
  borrowedUSD,
  borrowTokenIcon,
  borrowTokenName,
}: BorrowModalProps) {
  const [amount, setAmount] = useState("");
  const [healthPercentage, setHealthPercentage] = useState(69.91);

  const handleBorrow = () => {
    console.log("Borrowing:", amount);
    // Add borrow logic here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B121A] border-[#19242e] text-white max-w-[640px] p-0">
        {/* Header */}
        <DialogHeader className="border-b border-[#19242e] p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Borrow</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-neutral-400 mb-1">Supplied</div>
              <div className="text-lg font-semibold">
                {suppliedAmount} {suppliedToken}
              </div>
              <div className="text-xs text-neutral-400">{suppliedUSD}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 mb-1">Borrowed</div>
              <div className="text-lg font-semibold">
                {borrowedAmount} {borrowedToken}
              </div>
              <div className="text-xs text-neutral-400">{borrowedUSD}</div>
            </div>
          </div>

          {/* Borrow Input */}
          <div className="bg-[#0d1520] border border-[#19242e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-400">Borrow</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 flex items-center gap-x-1">
                  <CiWallet />
                  <span>0.00 {borrowedToken}</span>
                </span>
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

          {/* Health Bar with Status */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm font-medium text-orange-400">
                  Risky
                </span>
              </div>
              <span className="text-sm font-medium">{healthPercentage}%</span>
            </div>

            {/* Custom slider with markers */}
            <div className="relative">
              <div className="relative h-2 bg-[#1a2332] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-500 rounded-full"
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>

              {/* Slider handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-[#0B121A] cursor-pointer"
                style={{
                  left: `${healthPercentage}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Markers */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-neutral-600"
                style={{ left: "25%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-neutral-600"
                style={{ left: "50%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-neutral-600"
                style={{ left: "75%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-neutral-500"
                style={{ left: "100%" }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-neutral-500 mt-2">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>Max: L.T. 80%</span>
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

          {/* Borrow Button */}
          <button
            onClick={handleBorrow}
            className="cursor-pointer w-full bg-[#c7f284] text-black font-semibold py-3.5 rounded-lg hover:bg-[#91B163] transition-colors"
          >
            Borrow
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
