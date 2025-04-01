'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {lightTheme, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { ContractsInfoProvider } from "@/contexts/ContractsInfoContext";

import { config } from '@/utils/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({
            accentColor: '#3da14d',
        })}>
            <ContractsInfoProvider>
                {children}
            </ContractsInfoProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
