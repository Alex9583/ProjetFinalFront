import { createPublicClient, http } from 'viem'
import { hardhat, sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: process.env.ENABLE_TESTNETS === 'true' ? sepolia : hardhat,
  transport: http(process.env.RPC_URL)
})