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
        tokenAmountFormatted={positionData.collateralAmount.toFixed(2)}
        usdValue={positionData.collateralUSD}
        usdValueFormatted={`$${positionData.collateralUSD.toFixed(2)}`}
        tokenIcon="https://cdn.instadapp.io/icons/jupiter/tokens/sol.png"
        tokenName="Wrapped SOL"
        apyFormatted="6.3%" //hardcoded
        type="collateral"
        borrowed={positionData.debtAmount}
        supplied={positionData.collateralAmount}
        suppliedUsd={positionData.collateralUSD}
        solPrice={positionData.solPrice}
      />

      <Card
        title="Borrowed Debt"
        tokenSymbol="USDC"
        tokenAmount={positionData.debtAmount}
        tokenAmountFormatted={positionData.debtAmount.toFixed(2)}
        usdValue={positionData.debtUSD}
        usdValueFormatted={`$${positionData.debtUSD.toFixed(2)}`}
        tokenIcon="https://cdn.instadapp.io/icons/jupiter/tokens/usdc.png"
        tokenName="USD Coin"
        apyFormatted="4.6%" //hardcoded
        type="debt"
        borrowed={positionData.debtAmount}
        supplied={positionData.collateralAmount}
        suppliedUsd={positionData.collateralUSD}
        solPrice={positionData.solPrice}
      />

      <LastCard
        suppliedAmount={positionData.collateralAmount || 0}
        suppliedToken="SOL"
        suppliedAPY={6.3}
        borrowedAmount={positionData.debtAmount || 0}
        borrowedToken="USDC"
        borrowedAPY={4.6}
        solPrice={positionData.solPrice}
      />
    </div>
  );
};

export default CardContainer;
