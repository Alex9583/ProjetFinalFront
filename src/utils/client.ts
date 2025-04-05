import { createPublicClient, http } from 'viem'
import { hardhat } from 'viem/chains'
import { sepolia } from '@/utils/sepolia'

export const publicClient = createPublicClient({
    chain: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? sepolia : hardhat,
    transport: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA) : http(),
})