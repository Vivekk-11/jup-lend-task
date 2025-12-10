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
import { toast } from "sonner";
import { BN } from "bn.js";
import {
  ComputeBudgetProgram,
  Connection,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useUnifiedWallet } from "@jup-ag/wallet-adapter";
import { getOperateIx } from "@jup-ag/lend/borrow";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliedAmount: number;
  suppliedUSD: string;
  borrowedAmount: number;
  borrowedToken: string;
  borrowedUSD: string;
  tokenSymbol: string;
  tokenIcon: string;
  tokenName: string;
  solPrice: number;
}

export default function WithdrawModal({
  open,
  onOpenChange,
  suppliedAmount,
  suppliedUSD,
  borrowedAmount,
  borrowedToken,
  borrowedUSD,
  tokenSymbol,
  tokenIcon,
  tokenName,
  solPrice,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const { connected, publicKey, signTransaction } = useUnifiedWallet();

  const LIQUIDATION_THRESHOLD = 0.8;

  const withdrawAmount = parseFloat(amount) || 0;
  const newCollateral = Math.max(suppliedAmount - withdrawAmount, 0);

  const newCollateralValue = newCollateral * solPrice;
  const borrowedValue = borrowedAmount;

  const healthPercentage =
    newCollateralValue > 0
      ? Math.min((borrowedValue / newCollateralValue) * 100, 100)
      : borrowedValue > 0
      ? 100
      : 0;

  const liquidationPrice =
    newCollateral > 0
      ? borrowedValue / (newCollateral * LIQUIDATION_THRESHOLD)
      : 0;

  const currentPrice = solPrice;
  const priceDropPercentage =
    liquidationPrice > 0 && liquidationPrice < currentPrice
      ? ((currentPrice - liquidationPrice) / currentPrice) * 100
      : liquidationPrice === 0
      ? 100
      : 0;

  const getRiskStatus = () => {
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

  const handleWithdraw = async () => {
    try {
      const withdrawAmount = parseFloat(amount);

      if (isNaN(withdrawAmount)) {
        toast.error("Invalid withdrawal amount!");
        return;
      }

      if (withdrawAmount <= 0) {
        toast.error("Withdrawal amount should be greater than 0");
        return;
      }

      if (withdrawAmount > suppliedAmount) {
        toast.error("You cannot withdraw more than supplied collateral");
        return;
      }

      const DECIMALS = 9;
      const colAmount = new BN(-(withdrawAmount * 10 ** DECIMALS));
      const debtAmount = new BN(0);

      const rpcUrl =
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://api.mainnet-beta.solana.com";

      const connection = new Connection(rpcUrl);

      if (!connected || !publicKey || !signTransaction) {
        toast.error("Please connect your wallet first!");
        return;
      }

      const signer = publicKey;

      const { ixs, addressLookupTableAccounts } = await getOperateIx({
        vaultId: 1,
        positionId: 5762,
        colAmount,
        debtAmount,
        connection,
        signer,
      });

      const { blockhash } = await connection.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: signer,
        recentBlockhash: blockhash,
        instructions: [
          ComputeBudgetProgram.setComputeUnitLimit({
            units: 1_000_000,
          }),
          ...ixs,
        ],
      }).compileToV0Message(addressLookupTableAccounts);

      const transaction = new VersionedTransaction(messageV0);

      const signedTx = await signTransaction(transaction);

      const txid = await connection.sendRawTransaction(signedTx.serialize());

      toast.success("Withdrawal successful!");
      console.log("Withdrew: ", txid);
      onOpenChange(false);
    } catch (error) {
      toast.error("Something went wrong while withdrawing!");
      console.error("Something went wrong while withdrawing!", error);
    }
  };

  const handleHalf = () => {
    setAmount((suppliedAmount / 2).toFixed(6));
  };

  const handleMax = () => {
    setAmount(`${suppliedAmount}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B121A] border-[#19242e] text-white max-w-[640px] p-0">
        {/* Header */}
        <DialogHeader className="border-b border-[#19242e] p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Withdraw
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-neutral-400 mb-1">Supplied</div>
              <div className="text-lg font-semibold">
                {suppliedAmount} {tokenSymbol}
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

          {/* Withdraw Input */}
          <div className="bg-[#0d1520] border border-[#19242e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-400">Withdraw</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 flex items-center gap-x-1">
                  <CiWallet />
                  <span>
                    {suppliedAmount.toFixed(6)} {tokenSymbol}
                  </span>
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
                  src={tokenIcon}
                  alt={tokenName}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="font-semibold">{tokenSymbol}</span>
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
              If {tokenSymbol} reaches {liquidationPrice.toFixed(2)} USDC (drops
              by {priceDropPercentage.toFixed(2)}%), your position may be
              partially liquidated
            </p>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            className="cursor-pointer w-full bg-[#c7f284] text-black font-semibold py-3.5 rounded-lg hover:bg-[#91B163] transition-colors"
          >
            Withdraw
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
