'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

// Track page views
export const trackPageView = (url: string) => {
  track('page_view', { url });
};

// Track wallet connection
export const trackWalletConnection = (address: string, chainId: number) => {
  track('wallet_connected', {
    address: address.toString(),
    chainId: chainId.toString()
  });
};

// Track claim events
export const trackClaim = (networkName: string, chainId: number, userAddress: string) => {
  track('claim_attempt', {
    network: networkName,
    chainId: chainId.toString(),
    userAddress: userAddress
  });
};

// Track successful claims
export const trackClaimSuccess = (networkName: string, chainId: number, userAddress: string, hash: string) => {
  track('claim_success', {
    network: networkName,
    chainId: chainId.toString(),
    userAddress: userAddress,
    hash: hash
  });
};

// Analytics component to track page views
export default function AnalyticsTracker({ path }: { path: string }) {
  useEffect(() => {
    trackPageView(path);
  }, [path]);

  return null;
}
