"use client";

import { useState } from "react";
import Image from "next/image";
import { IoIosSwap } from "react-icons/io";
import BorrowModal from "./borrow-modal";
import RepayModal from "./repay-modal";
import DepositModal from "./deposit-modal";
import WithdrawModal from "./withdraw-modal";

interface Props {
  title: string;
  tokenSymbol: string;
  tokenAmount: number;
  tokenAmountFormatted: string;
  usdValue: number;
  usdValueFormatted: string;
  tokenIcon: string;
  tokenName: string;
  apyFormatted: string;
  type: "collateral" | "debt";
  borrowed: number;
  supplied: number;
  suppliedUsd: number;
  solPrice: number;
}

const Card = ({
  title,
  tokenSymbol,
  tokenAmount,
  tokenAmountFormatted,
  usdValue,
  usdValueFormatted,
  tokenIcon,
  tokenName,
  apyFormatted,
  type,
  borrowed,
  supplied,
  suppliedUsd,
  solPrice,
}: Props) => {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [repayModalOpen, setRepayModalOpen] = useState(false);

  // Determine APY color based on type
  const apyColor =
    type === "collateral" ? "text-emerald-400" : "text-orange-400";

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#19242e] bg-[#0B121A]">
        <div className="flex items-center justify-between border-b border-[#19242e] p-4">
          <span className="text-xs font-medium text-neutral-200">{title}</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#19242e] p-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Image
              className="size-9 sm:size-10"
              height="32"
              width="32"
              alt={tokenName}
              src={tokenIcon}
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-neutral-200 sm:text-xl">
                <span
                  className="relative items-center rounded-sm inline-block"
                  data-num={tokenAmount}
                >
                  <span translate="no">
                    {tokenAmountFormatted} {tokenSymbol}
                  </span>
                </span>
              </span>
              <span
                className="relative inline-flex items-center rounded-sm text-xs text-neutral-400"
                data-num={usdValue}
              >
                <span translate="no">{usdValueFormatted}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5 text-lg font-medium sm:text-xl">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="radix-:rl:"
                data-state="closed"
                className="outline-none"
              >
                <div className="flex items-center gap-1">
                  <div className="flex items-center -space-x-1.5 empty:hidden">
                    <Image
                      className="size-4"
                      height="32"
                      width="32"
                      alt={tokenName}
                      src={tokenIcon}
                    />
                  </div>
                  <span
                    className={`flex underline decoration-dashed decoration-from-font underline-offset-4 ${apyColor}`}
                  >
                    {apyFormatted}
                  </span>
                </div>
              </button>
            </div>
            <button
              type="button"
              className="outline-none inline-flex items-center gap-1 hover:text-neutral-200 ml-auto text-xs text-neutral-400"
            >
              <span className="uppercase">apy</span>
              <IoIosSwap className="text-neutral-400 hover:text-neutral-200" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4 sm:gap-4">
          {type === "collateral" ? (
            <>
              {/* Deposit Button */}
              <button
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-[#c7f284] text-neutral-950 hover:bg-[#91B163] px-4 py-2.5 text-xs rounded-lg"
                onClick={() => setDepositModalOpen(true)}
              >
                <span className="contents truncate">Deposit</span>
              </button>
              {/* Withdraw Button */}
              <button
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-[#c7f2840d] text-[#c7f284] hover:bg-[#2D392C] focus:ring-primary/10 px-4 py-2.5 text-xs rounded-lg"
                onClick={() => setWithdrawModalOpen(true)}
              >
                <span className="contents truncate">Withdraw</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-[#c7f284] text-neutral-950 hover:bg-[#91B163] px-4 py-2.5 text-xs rounded-lg"
                onClick={() => setBorrowModalOpen(true)}
              >
                <span className="contents truncate">Borrow</span>
              </button>
              <button
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-[#c7f2840d] text-[#c7f284] hover:bg-[#2D392C] focus:ring-primary/10 px-4 py-2.5 text-xs rounded-lg"
                onClick={() => setRepayModalOpen(true)}
              >
                <span className="contents truncate">Repay</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {type === "collateral" && (
        <>
          <DepositModal
            open={depositModalOpen}
            onOpenChange={setDepositModalOpen}
            suppliedCollateral={supplied}
            borrowedAmount={borrowed}
            borrowedToken="USDC"
            borrowedUSD={`$${borrowed}`}
            tokenSymbol={tokenSymbol}
            tokenIcon={tokenIcon}
            tokenName={tokenName}
            solPrice={solPrice}
          />
          <WithdrawModal
            open={withdrawModalOpen}
            onOpenChange={setWithdrawModalOpen}
            suppliedAmount={tokenAmount}
            suppliedUSD={usdValueFormatted}
            borrowedAmount={borrowed}
            borrowedToken="USDC"
            borrowedUSD={`$${borrowed}`}
            tokenSymbol={tokenSymbol}
            tokenIcon={tokenIcon}
            tokenName={tokenName}
            solPrice={solPrice}
          />
        </>
      )}

      {type === "debt" && (
        <>
          <BorrowModal
            open={borrowModalOpen}
            onOpenChange={setBorrowModalOpen}
            suppliedAmount={supplied}
            suppliedToken="SOL"
            suppliedUSD={suppliedUsd}
            borrowedAmount={tokenAmount}
            borrowedToken={tokenSymbol}
            borrowedUSD={usdValueFormatted}
            borrowTokenIcon={tokenIcon}
            borrowTokenName={tokenName}
            solPrice={solPrice}
          />
          <RepayModal
            open={repayModalOpen}
            onOpenChange={setRepayModalOpen}
            borrowedAmount={tokenAmount}
            borrowedToken={tokenSymbol}
            borrowedUSD={usdValueFormatted}
            borrowTokenIcon={tokenIcon}
            borrowTokenName={tokenName}
            solPrice={solPrice}
          />
        </>
      )}
    </>
  );
};

export default Card;
