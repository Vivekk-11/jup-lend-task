"use client";

import { usePositionData } from "@/hooks/use-position-data";
import Card from "./card";
import LastCard from "./last-card";

const CardContainer = () => {
  const vaultId = 1;
  const positionId = 5762;

  const { positionData, loading, error } = usePositionData(vaultId, positionId);

  if (loading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3 sm:grid-cols-2">
        <div className="animate-pulse bg-[#0d1520] rounded-xl h-32" />
        <div className="animate-pulse bg-[#0d1520] rounded-xl h-32" />
        <div className="animate-pulse bg-[#0d1520] rounded-xl h-32" />
      </div>
    );
  }

  if (error || !positionData) {
    return (
      <div className="text-red-500 p-4 bg-red-500/10 rounded-xl">
        Error loading position data: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3 sm:grid-cols-2">
      <Card
        title="Supplied Collateral"
        tokenSymbol="SOL"
        tokenAmount={positionData.collateralAmount}
        tokenAmountFormatted={positionData.collateralAmount.toFixed(6)}
        usdValue={positionData.collateralUSD}
        usdValueFormatted={`$${positionData.collateralUSD.toFixed(2)}`}
        tokenIcon="https://cdn.instadapp.io/icons/jupiter/tokens/sol.png"
        tokenName="Wrapped SOL"
        apyFormatted="6.3%"
        type="collateral"
        borrowed={positionData.debtAmount} // ✅ Debt in USDC tokens
        supplied={positionData.collateralAmount} // ✅ Collateral in SOL
        suppliedUsd={positionData.collateralUSD} // ✅ Collateral USD value
      />

      <Card
        title="Borrowed Debt"
        tokenSymbol="USDC"
        tokenAmount={positionData.debtAmount}
        tokenAmountFormatted={positionData.debtAmount.toFixed(4)}
        usdValue={positionData.debtUSD}
        usdValueFormatted={`$${positionData.debtUSD.toFixed(4)}`}
        tokenIcon="https://cdn.instadapp.io/icons/jupiter/tokens/usdc.png"
        tokenName="USD Coin"
        apyFormatted="4.6%"
        type="debt"
        borrowed={positionData.debtAmount} // ✅ Debt in USDC tokens
        supplied={positionData.collateralAmount} // ✅ Collateral in SOL
        suppliedUsd={positionData.collateralUSD} // ✅ Collateral USD value
      />

      <LastCard
        suppliedAmount={positionData.collateralAmount}
        suppliedToken="SOL"
        suppliedAPY={6.3}
        borrowedAmount={positionData.debtAmount}
        borrowedToken="USDC"
        borrowedAPY={4.6}
        solPrice={132}
      />
    </div>
  );
};

export default CardContainer;
