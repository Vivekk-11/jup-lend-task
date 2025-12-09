"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
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

  const LIQUIDATION_THRESHOLD = 0.8;
  const SOL_PRICE = 132;

  // Calculate new borrowed amount
  const additionalBorrow = parseFloat(amount) || 0;
  const newBorrowedAmount = borrowedAmount + additionalBorrow;

  // Calculate collateral value
  const collateralValue = suppliedAmount * SOL_PRICE;

  // Calculate health percentage (LTV utilization)
  // Cap at 100%
  const healthPercentage =
    collateralValue > 0
      ? Math.min((newBorrowedAmount / collateralValue) * 100, 100)
      : 0;

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    // Calculate how much to borrow at this percentage
    const targetBorrowed = (collateralValue * percentage) / 100;
    const newBorrowAmount = Math.max(targetBorrowed - borrowedAmount, 0);
    setAmount(newBorrowAmount.toFixed(2));
  };

  // Calculate liquidation price
  const liquidationPrice =
    suppliedAmount > 0
      ? newBorrowedAmount / (suppliedAmount * LIQUIDATION_THRESHOLD)
      : 0;

  const currentPrice = SOL_PRICE;

  // Determine risk status
  const getRiskStatus = () => {
    if (healthPercentage >= 80)
      return { text: "Liquidated", color: "text-red-500" };
    if (healthPercentage >= 75)
      return { text: "Very Risky", color: "text-orange-500" };
    if (healthPercentage >= 60)
      return { text: "Risky", color: "text-orange-400" };
    if (healthPercentage >= 30)
      return { text: "Moderate", color: "text-yellow-400" };
    return { text: "Safe", color: "text-emerald-400" };
  };

  const riskStatus = getRiskStatus();

  // Get health bar color based on percentage
  const getHealthBarColor = () => {
    if (healthPercentage >= 80)
      return "bg-gradient-to-r from-red-600 to-red-500";
    if (healthPercentage >= 75)
      return "bg-gradient-to-r from-orange-500 to-red-500";
    if (healthPercentage >= 60)
      return "bg-gradient-to-r from-orange-500 to-orange-400";
    if (healthPercentage >= 30)
      return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-emerald-500 to-green-500";
  };

  // Get slider thumb color
  const getSliderThumbColor = () => {
    if (healthPercentage >= 80) return "bg-red-500";
    if (healthPercentage >= 75) return "bg-orange-500";
    if (healthPercentage >= 60) return "bg-orange-400";
    if (healthPercentage >= 30) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const handleBorrow = () => {
    console.log("Borrowing:", amount);
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
                <span className="text-xs text-neutral-400 flex items-center gap-x-1.5">
                  <CiWallet /> <span>0.00 {borrowedToken}</span>
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

          {/* Health Bar with Status and Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-sm font-medium ${riskStatus.color}`}>
                  {riskStatus.text}
                </span>
              </div>
              <span className="text-sm font-medium">
                {healthPercentage.toFixed(2)}%
              </span>
            </div>

            {/* Custom Slider */}
            <div className="relative h-2">
              {/* Background track */}
              <div className="absolute inset-0 bg-[#1a2632] rounded-full" />

              {/* Filled track with gradient */}
              <div
                className={cn(
                  "absolute left-0 top-0 h-full rounded-full transition-all",
                  getHealthBarColor()
                )}
                style={{ width: `${healthPercentage}%` }}
              />

              {/* Markers */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#0B121A] pointer-events-none z-10"
                style={{ left: "25%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#0B121A] pointer-events-none z-10"
                style={{ left: "50%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#0B121A] pointer-events-none z-10"
                style={{ left: "75%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#0B121A] pointer-events-none z-10"
                style={{ left: "80%" }}
              />

              {/* Slider thumb */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white cursor-pointer transition-all z-20",
                  getSliderThumbColor()
                )}
                style={{ left: `${healthPercentage}%` }}
              />

              {/* Invisible input for interaction */}
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={healthPercentage}
                onChange={(e) =>
                  handleSliderChange([parseFloat(e.target.value)])
                }
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-30"
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
            {liquidationPrice > 0 && liquidationPrice < currentPrice ? (
              <p>
                If {suppliedToken} drops to {liquidationPrice.toFixed(2)} USDC
                (drops by{" "}
                {(
                  ((currentPrice - liquidationPrice) / currentPrice) *
                  100
                ).toFixed(2)}
                %), your position may be partially liquidated
              </p>
            ) : liquidationPrice >= currentPrice ? (
              <p>
                Your position is at high risk of liquidation. The liquidation
                threshold has been reached or exceeded.
              </p>
            ) : (
              <p>
                Your position is safe from liquidation at current collateral
                levels.
              </p>
            )}
          </div>

          {/* Borrow Button */}
          <button
            onClick={handleBorrow}
            disabled={healthPercentage >= 80}
            className="w-full bg-[#c7f284] text-black font-semibold py-3.5 rounded-lg hover:bg-[#91B163] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Borrow
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
