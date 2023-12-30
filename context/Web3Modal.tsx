"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { mainnet, bsc, polygon, avalanche, arbitrum, optimism, opBNB } from 'viem/chains'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'f7a7f01f57658745abcd1e41417b487d'

// 2. Create wagmiConfig
const metadata = {
    name: 'Insperse',
    description: 'distribute inscriptions to multiple addresses',
    url: 'https://insperse.48.club',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    enableAuthMode: true,
}

const chains = [bsc]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Modal({ children }: { children: React.ReactNode }) {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}