"use client";

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { mainnet, sepolia } from 'wagmi/chains';
import { ReactNode } from "react";

const config = getDefaultConfig({
  appName: 'Perp Exchange',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, sepolia],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}