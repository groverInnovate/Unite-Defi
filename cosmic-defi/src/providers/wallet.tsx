'use client'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig, lightTheme, darkTheme } from '@rainbow-me/rainbowkit'
import {
  mainnet, sepolia,
  polygon, polygonMumbai,
  arbitrum, arbitrumSepolia,
} from 'wagmi/chains'

// Your custom chains (unchanged)
export const monadTestnet = {
  id: 41454,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { 
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://10143.rpc.thirdweb.com'] }
  },
  blockExplorers: { 
    default: { name: 'MonadScan', url: 'https://testnet.monadscan.com/' }
  },
  testnet: true,
} as const

// Wagmi config (unchanged)
const wagmiConfig = getDefaultConfig({
  appName: 'Cosmic DeFi - 1inch Fusion+ Extension',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [
    mainnet, 
    sepolia,
    monadTestnet,
    polygon,
    arbitrum,
  ] as const,
  ssr: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          // FIXED: Correct theme configuration using lightTheme/darkTheme functions
          theme={darkTheme({
            accentColor: '#6366f1',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


