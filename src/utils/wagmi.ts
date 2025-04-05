import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import {hardhat} from 'wagmi/chains';
import {sepolia} from '@/utils/sepolia';

export const config = getDefaultConfig({
    appName: 'SuperHelper Dapp',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
    chains: [
        process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? sepolia : hardhat,
    ],
    ssr: true,
});
