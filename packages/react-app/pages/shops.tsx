import React, { useState, useEffect, useCallback } from 'react';
import { FaStore, FaShoppingCart } from 'react-icons/fa';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { celoAlfajores } from 'viem/chains';
import RewardTribeABI from '../contexts/RewardTribe-abi.json'; // Make sure to import your contract ABI

const REWARD_TRIBE_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';
const cUSDTokenAddress = 'YOUR_cUSD_TOKEN_ADDRESS_HERE';

interface Shop {
  id: string;
  name: string;
  address: string;
  description: string;
}

function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);

  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http()
  });

  const fetchShops = useCallback(async () => {
    try {
      const storeAddresses = await publicClient.readContract({
        address: REWARD_TRIBE_ADDRESS,
        abi: RewardTribeABI,
        functionName: 'getAllStores',
      }) as string[];

      const shopPromises = storeAddresses.map(async (address) => {
        const storeDetails = await publicClient.readContract({
          address: REWARD_TRIBE_ADDRESS,
          abi: RewardTribeABI,
          functionName: 'getStoreDetails',
          args: [address],
        }) as [string, string, boolean];

        return {
          id: address,
          name: storeDetails[0],
          address: address,
          description: "Store on RewardTribe" // You might want to add a description field to your smart contract if needed
        };
      });

      const shopData = await Promise.all(shopPromises);
      setShops(shopData);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handlePay = useCallback(async (shopAddress: string) => {
    try {
      let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
      });

      let [address] = await walletClient.getAddresses();

      const tx = await walletClient.writeContract({
        address: REWARD_TRIBE_ADDRESS,
        abi: RewardTribeABI,
        functionName: "purchaseAndEarnRewards",
        account: address,
        args: [shopAddress, BigInt(100000000000000000)], // 0.1 cUSD as an example
        feeCurrency: cUSDTokenAddress,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      console.log(`Payment to shop ${shopAddress} successful`, receipt);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  }, [publicClient]);

  return (
    <div className="max-w-4xl mx-auto p-4 border-2 border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <FaStore className="inline-block mr-2 mb-1" />
        Available Shops
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {shops.map((shop) => (
          <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-200">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">{shop.name}</h2>
              <p className="text-gray-600 mb-2">{shop.description}</p>
              <p className="text-sm text-gray-500 mb-4">Address: {shop.address}</p>
            </div>
            <div className="bg-gray-100 px-4 py-3 flex justify-end">
              <button
                onClick={() => handlePay(shop.address)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
              >
                <FaShoppingCart className="mr-2" />
                Pay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shops;