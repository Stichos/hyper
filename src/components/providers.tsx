'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, optimism, arbitrum, base } from 'wagmi/chains';
import { ConnectKitProvider } from 'connectkit';
import { type ReactNode, useState } from 'react';

// Configure wagmi client
const config = createConfig({
  chains: [mainnet, optimism, arbitrum, base], // Using arrays for chains
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
