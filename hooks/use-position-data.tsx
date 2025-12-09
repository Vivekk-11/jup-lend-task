// hooks/usePositionData.ts
import { useEffect, useState } from "react";
import { Connection } from "@solana/web3.js";
import { fetchPositionData, PositionAccount } from "@/lib/fetch-position";

interface PositionData {
  collateralAmount: number;
  collateralUSD: number;
  debtAmount: number;
  debtUSD: number;
  ltv: number;
  rawPosition: PositionAccount;
}

export const usePositionData = (vaultId: number, positionId: number) => {
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const connection = new Connection(
          process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
          "confirmed"
        );

        const rawPosition = await fetchPositionData(
          connection,
          vaultId,
          positionId
        );

        const collateralAmount = rawPosition.supplyAmount.toNumber() / 10 ** 9;
        const debtAmount = rawPosition.dustDebtAmount.toNumber() / 10 ** 6;

        const solPrice = 132; // TODO: Fetch from oracle
        const usdcPrice = 1;

        const collateralUSD = collateralAmount * solPrice;
        const debtUSD = debtAmount * usdcPrice;

        const ltv = collateralUSD > 0 ? (debtUSD / collateralUSD) * 100 : 0;

        setPositionData({
          collateralAmount,
          collateralUSD,
          debtAmount,
          debtUSD,
          ltv,
          rawPosition,
        });
      } catch (err) {
        console.error("Error fetching position data:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (vaultId && positionId) {
      fetchData();
    }
  }, [vaultId, positionId]);

  return { positionData, loading, error };
};
