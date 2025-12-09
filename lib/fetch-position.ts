/* eslint-disable @typescript-eslint/no-explicit-any */

import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { JUPITER_LEND_IDL } from "./jupiter-lend-idl";
import BN from "bn.js";

const JUPITER_LEND_PROGRAM_ID = new PublicKey(
  "jupr81YtYssSyPt8jbnGuiWon5f6x9TcDEFxYe3Bdzi"
);

export function getPositionPDA(vaultId: number, nftId: number): PublicKey {
  const [positionPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("position"),
      new BN(vaultId).toArrayLike(Buffer, "le", 2),
      new BN(nftId).toArrayLike(Buffer, "le", 4),
    ],
    JUPITER_LEND_PROGRAM_ID
  );
  return positionPDA;
}

export interface PositionAccount {
  vaultId: number;
  nftId: number;
  positionMint: PublicKey;
  isSupplyOnlyPosition: number;
  tick: number;
  tickId: number;
  supplyAmount: BN;
  dustDebtAmount: BN;
}

export async function fetchPositionData(
  connection: Connection,
  vaultId: number,
  positionId: number
): Promise<PositionAccount> {
  try {
    const positionPDA = getPositionPDA(vaultId, positionId);
    const provider = new AnchorProvider(connection, {} as any, {
      commitment: "confirmed",
    });

    const program = new Program(
      JUPITER_LEND_IDL as Idl,
      provider,
    );

    const position = (await (program.account as any).position.fetch(positionPDA)) as any;

    return {
      vaultId: position.vaultId,
      nftId: position.nftId,
      positionMint: position.positionMint,
      isSupplyOnlyPosition: position.isSupplyOnlyPosition,
      tick: position.tick,
      tickId: position.tickId,
      supplyAmount: position.supplyAmount,
      dustDebtAmount: position.dustDebtAmount,
    };
  } catch (error) {
    console.error("Error fetching position:", error);
    throw error;
  }
}
