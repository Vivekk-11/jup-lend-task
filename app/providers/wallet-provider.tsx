"use client";

import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import { ReactNode, useMemo } from "react";

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => [], []);

  return (
    <UnifiedWalletProvider
      wallets={wallets}
      config={{
        autoConnect: true,
        env: "mainnet-beta",
        metadata: {
          name: "My dApp",
          description: "Solana App",
          url: "https://localhost",
          iconUrls: ["https://jup.ag/favicon.ico"],
        },
      }}
    >
      {children}
    </UnifiedWalletProvider>
  );
}
