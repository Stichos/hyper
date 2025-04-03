'use client';

import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useChainId } from "wagmi";
import { useEffect } from "react";
import { trackWalletConnection } from "@/components/analytics";

export default function Header() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Track wallet connection
  useEffect(() => {
    if (isConnected && address && chainId) {
      trackWalletConnection(address, chainId);
    }
  }, [isConnected, address, chainId]);

  return (
    <header className="w-full p-4">
      <div className="hyperlane-container flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://ext.same-assets.com/1999836307/1042642129.svg"
            alt="Hyperlane Logo"
            width={40}
            height={40}
          />
          <span className="ml-2 text-white text-2xl font-bold">Hyperlane</span>
        </Link>

        <ConnectKitButton />
      </div>
    </header>
  );
}
