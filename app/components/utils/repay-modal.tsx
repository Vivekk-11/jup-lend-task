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

interface RepayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrowedAmount: number;
  borrowedToken: string;
  borrowedUSD: string;
  borrowTokenIcon: string;
  borrowTokenName: string;
  suppliedAmount?: number;
  suppliedToken?: string;
}

export default function RepayModal({
  open,
  onOpenChange,
  borrowedAmount,
  borrowedToken,
  borrowedUSD,
  borrowTokenIcon,
  borrowTokenName,
  suppliedAmount = 0.094125,
  suppliedToken = "SOL",
}: RepayModalProps) {
  const [amount, setAmount] = useState("");

  const LIQUIDATION_THRESHOLD = 0.8;
  const SOL_PRICE = 132;

  const repayAmount = parseFloat(amount) || 0;
  const newBorrowedAmount = Math.max(borrowedAmount - repayAmount, 0);

  const collateralValue = suppliedAmount * SOL_PRICE;

  const healthPercentage =
    collateralValue > 0 && newBorrowedAmount > 0
      ? Math.min((newBorrowedAmount / collateralValue) * 100, 100)
      : 0;

  const liquidationPrice =
    suppliedAmount > 0 && newBorrowedAmount > 0
      ? newBorrowedAmount / (suppliedAmount * LIQUIDATION_THRESHOLD)
      : 0;

  const currentPrice = SOL_PRICE;
  const priceDropPercentage =
    liquidationPrice > 0 && liquidationPrice < currentPrice
      ? ((currentPrice - liquidationPrice) / currentPrice) * 100
      : 0;

  const getRiskStatus = () => {
    if (newBorrowedAmount === 0)
      return { text: "Safe", color: "text-emerald-400" };
    if (healthPercentage >= 80)
      return { text: "Liquidated", color: "text-red-500" };
    if (healthPercentage >= 60)
      return { text: "Risky", color: "text-orange-400" };
    if (healthPercentage >= 30)
      return { text: "Moderate", color: "text-yellow-400" };
    return { text: "Safe", color: "text-emerald-400" };
  };

  const riskStatus = getRiskStatus();

  const getHealthBarColor = () => {
    if (healthPercentage >= 80) return "from-red-600 to-red-500";
    if (healthPercentage >= 60) return "from-orange-500 to-red-500";
    if (healthPercentage >= 30) return "from-yellow-500 to-orange-500";
    return "from-emerald-500 to-green-500";
  };

  const handleRepay = () => {
    console.log("Repaying:", amount);
  };

  const handleHalf = () => {
    setAmount((borrowedAmount / 2).toFixed(6));
  };

  const handleMax = () => {
    setAmount(borrowedAmount.toFixed(6));
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
                  <span> 0.00 {borrowedToken}</span>
                </span>
                <button
                  onClick={handleHalf}
                  className="text-xs px-2 py-0.5 bg-[#19242e] rounded text-neutral-300 hover:bg-[#1f2937]"
                >
                  HALF
                </button>
                <button
                  onClick={handleMax}
                  className="text-xs px-2 py-0.5 bg-[#19242e] rounded text-neutral-300 hover:bg-[#1f2937]"
                >
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
              <span className="text-sm font-medium">
                {healthPercentage.toFixed(2)}%
              </span>
              <span className={`text-sm font-medium ${riskStatus.color}`}>
                {riskStatus.text}
              </span>
            </div>
            <div className="relative h-2 bg-[#1a2332] rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getHealthBarColor()} rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(healthPercentage, 100)}%` }}
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
              If {suppliedToken} reaches {liquidationPrice.toFixed(2)} USDC
              (drops by {priceDropPercentage.toFixed(2)}%), your position may be
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
