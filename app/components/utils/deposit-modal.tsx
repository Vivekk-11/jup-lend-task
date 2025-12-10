"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CiWallet } from "react-icons/ci";
import BN from "bn.js";
import {
  ComputeBudgetProgram,
  Connection,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { getOperateIx } from "@jup-ag/lend/borrow";
import { toast } from "sonner";
import { useUnifiedWallet } from "@jup-ag/wallet-adapter";
import {
  NATIVE_MINT,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createAssociatedTokenAccount,
} from "@solana/spl-token";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliedCollateral: number;
  borrowedAmount: number;
  borrowedToken: string;
  borrowedUSD: string;
  tokenSymbol: string;
  tokenIcon: string;
  tokenName: string;
  solPrice: number;
}

export default function DepositModal({
  open,
  onOpenChange,
  suppliedCollateral,
  borrowedAmount,
  borrowedToken,
  borrowedUSD,
  tokenSymbol,
  tokenIcon,
  tokenName,
  solPrice,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const { connected, publicKey, signTransaction } = useUnifiedWallet();

  const LIQUIDATION_THRESHOLD = 0.8;

  const currentCollateral = suppliedCollateral; // Current SOL balance
  const depositAmount = parseFloat(amount) || 0;
  const newCollateral = currentCollateral + depositAmount;

  const newCollateralValue = newCollateral * solPrice;
  const borrowedValue = borrowedAmount;

  const healthPercentage = (borrowedValue / newCollateralValue) * 100 || 0; //how much of your collateral value you've borrowed

  const liquidationPrice =
    newCollateral > 0
      ? borrowedValue / (newCollateral * LIQUIDATION_THRESHOLD)
      : 0;

  const currentPrice = solPrice;
  const priceDropPercentage =
    newCollateral > 0
      ? ((currentPrice - liquidationPrice) / currentPrice) * 100
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

  const handleDeposit = async () => {
    try {
      const depositAmount = parseFloat(amount);

      if (isNaN(depositAmount)) {
        console.error("Invalid amount");
        return;
      }

      if (depositAmount <= 0) {
        console.error("Amount must be greater than 0");
        return;
      }

      const DECIMALS = 9;
      const colAmount = new BN(depositAmount * 10 ** DECIMALS);
      const debtAmount = new BN(0);

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;

      const connection = new Connection(rpcUrl);

      if (!connected || !publicKey || !signTransaction) {
        toast.error("Please connect your wallet first!");
        return;
      }

      if (depositAmount > walletBalance) {
        toast.error("Insufficient Balance!");
        return;
      }

      const signer = publicKey;

      const wsolAccount = getAssociatedTokenAddressSync(NATIVE_MINT, signer);

      const preInstructions = [];

      const accountInfo = await connection.getAccountInfo(wsolAccount);

      if (!accountInfo) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            signer,
            wsolAccount,
            signer,
            NATIVE_MINT
          )
        );
      }

      preInstructions.push(
        SystemProgram.transfer({
          fromPubkey: signer,
          toPubkey: wsolAccount,
          lamports: colAmount.toNumber(),
        })
      );

      preInstructions.push(createSyncNativeInstruction(wsolAccount));

      const { ixs, addressLookupTableAccounts } = await getOperateIx({
        vaultId: 1,
        positionId: 5762,
        colAmount,
        debtAmount,
        signer,
        connection,
      });

      const { blockhash } = await connection.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: signer,
        recentBlockhash: blockhash,
        instructions: [
          ComputeBudgetProgram.setComputeUnitLimit({
            units: 1_000_000,
          }),
          ...preInstructions,
          ...ixs,
        ],
      }).compileToV0Message(addressLookupTableAccounts);

      const transaction = new VersionedTransaction(messageV0);

      const signedTx = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTx.serialize());

      toast.success(`Successfully deposited ${amount}`);

      console.log("Deposited: ", txid);
      onOpenChange(false);
    } catch (error) {
      toast.error("Something went wrong while depositing!");
      console.error("Error during deposit getOperateIx:", error);
    }
  };

  useEffect(() => {
    (async () => {
      if (!publicKey) {
        setWalletBalance(0);
        return;
      }

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;

      const connection = new Connection(rpcUrl);

      const walletBalance = await connection.getBalance(publicKey);
      const walletBalanceSOL = walletBalance / 1e9;

      setWalletBalance(walletBalanceSOL);
    })();
  }, [publicKey]);

  const handleHalf = () => {
    setAmount((walletBalance / 2).toFixed(6));
  };

  const handleMax = () => {
    setAmount(`${walletBalance}`);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B121A] border-[#19242e] text-white max-w-[640px] p-0">
        {/* Header */}
        <DialogHeader className="border-b border-[#19242e] p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Deposit</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-neutral-400 mb-1">Token Balance</div>
              <div className="text-lg font-semibold">
                {walletBalance.toFixed(6)} {tokenSymbol}
              </div>
              <div className="text-xs text-neutral-400">
                ${(walletBalance * solPrice).toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 mb-1">Borrowed</div>
              <div className="text-lg font-semibold">
                {borrowedAmount} {borrowedToken}
              </div>
              <div className="text-xs text-neutral-400">{borrowedUSD}</div>
            </div>
          </div>

          {/* Deposit Input */}
          <div className="bg-[#0d1520] border border-[#19242e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-400">Deposit</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 flex items-center gap-x-1">
                  <CiWallet />
                  <span>
                    {walletBalance.toFixed(2)} {tokenSymbol}
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
              {newCollateral > 0 ? (
                <>
                  If SOL reaches {liquidationPrice.toFixed(2)} USDC (drops by{" "}
                  {priceDropPercentage.toFixed(2)}%), your position may be
                  partially liquidated
                </>
              ) : (
                <>Add collateral to see liquidation details</>
              )}
            </p>
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            className="cursor-pointer w-full bg-[#c7f284] text-black font-semibold py-3.5 rounded-lg hover:bg-[#91B163] transition-colors"
          >
            Deposit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
