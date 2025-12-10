import { useEffect, useState } from "react";
import { Connection, Keypair } from "@solana/web3.js";
import { fetchPositionData, PositionAccount } from "@/lib/fetch-position";
import { fetchSolPrice } from "@/lib/fetch-oracle-price";
import * as JupLend from "@jup-ag/lend/borrow";
import { useUnifiedWallet } from "@jup-ag/wallet-adapter";

interface PositionData {
  collateralAmount: number;
  collateralUSD: number;
  debtAmount: number;
  debtUSD: number;
  ltv: number;
  rawPosition: PositionAccount;
  solPrice: number;
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

        const dummyKeypair = Keypair.generate();

        const program = JupLend.getVaultsProgram({
          connection,
          signer: dummyKeypair.publicKey,
        });

        const rawPosition = await fetchPositionData(
          connection,
          vaultId,
          positionId
        );

        const positionState = await JupLend.getCurrentPositionState({
          vaultId: 1,
          position: rawPosition,
          program,
        });

        const collateralAmount = positionState.colRaw.toNumber() / 10 ** 9;
        const debtAmount = positionState.debtRaw.toNumber() / 10 ** 9;

        const solPrice = await fetchSolPrice();
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
          solPrice,
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
