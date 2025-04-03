import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  hardhat,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SuperHelper Dapp',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains: [
    process.env.ENABLE_TESTNETS === 'true' ? sepolia : hardhat,
  ],
  ssr: true,
});
