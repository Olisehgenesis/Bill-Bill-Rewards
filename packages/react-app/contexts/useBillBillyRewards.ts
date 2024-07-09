import { useState, useEffect, useCallback } from "react";
import {
    createPublicClient,
    createWalletClient,
    custom,
    getContract,
    http,
    parseEther,
    formatEther,
    Address,
} from "viem";
import { celoAlfajores } from "viem/chains";

// Import your contract ABI
import abi from "./BillBillyRewards-abi.json";

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x289E16e6B6943AbB8Ffb80c73D32920064253f5B" as Address;

export const useBillBillyRewards = () => {
    const [address, setAddress] = useState<Address | null>(null);
    const [walletClient, setWalletClient] = useState<any | null>(null);
    const [contract, setContract] = useState<any | null>(null);

    const getUserAddress = useCallback(async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            const client = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });

            const [address] = await client.getAddresses();
            setAddress(address);
            setWalletClient(client);

            const contract = getContract({
                address: CONTRACT_ADDRESS,
                abi,
                publicClient,
                walletClient: client,
            });
            setContract(contract);
        }
    }, []);

    useEffect(() => {
        getUserAddress();
    }, [getUserAddress]);

    const registerUser = useCallback(async (email: string, password: string, isShopper: boolean, isBusinessOwner: boolean) => {
        if (!contract || !address) return;
        try {
            const tx = await contract.write.registerUser([email, password, isShopper, isBusinessOwner]);
            await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("User registered successfully");
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }, [contract, address]);

    const registerStore = useCallback(async (name: string) => {
        if (!contract || !address) return;
        try {
            const tx = await contract.write.registerStore([name]);
            await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("Store registered successfully");
        } catch (error) {
            console.error("Error registering store:", error);
        }
    }, [contract, address]);

    const purchaseAndEarnRewards = useCallback(async (store: Address, amount: string) => {
        if (!contract || !address) return;
        try {
            const tx = await contract.write.purchaseAndEarnRewards([store, parseEther(amount)]);
            await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("Purchase successful and rewards earned");
        } catch (error) {
            console.error("Error in purchase:", error);
        }
    }, [contract, address]);

    const referProduct = useCallback(async (referredUser: Address) => {
        if (!contract || !address) return;
        try {
            const tx = await contract.write.referProduct([referredUser]);
            await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("Product referred successfully");
        } catch (error) {
            console.error("Error referring product:", error);
        }
    }, [contract, address]);

    const createGiftCard = useCallback(async (value: string, pointCost: number) => {
        if (!contract || !address) return;
        try {
            const tx = await contract.write.createGiftCard([parseEther(value), BigInt(pointCost)]);
            await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("Gift card created successfully");
        } catch (error) {
            console.error("Error creating gift card:", error);
        }
    }, [contract, address]);

    const awardGiftCard = useCallback(async (giftCardId: number, recipient: Address) => {
        if (!contract || !address) return;
        try {
            const tx = await contract.write.awardGiftCard([BigInt(giftCardId), recipient]);
            await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("Gift card awarded successfully");
        } catch (error) {
            console.error("Error awarding gift card:", error);
        }
    }, [contract, address]);

    const getStorePoints = useCallback(async (user: Address, store: Address) => {
        if (!contract) return null;
        try {
            const points = await contract.read.getStorePoints([user, store]);
            return Number(points);
        } catch (error) {
            console.error("Error getting store points:", error);
            return null;
        }
    }, [contract]);

    const getTotalPoints = useCallback(async (user: Address) => {
        if (!contract) return null;
        try {
            const points = await contract.read.getTotalPoints([user]);
            return Number(points);
        } catch (error) {
            console.error("Error getting total points:", error);
            return null;
        }
    }, [contract]);

    const getUserDetails = useCallback(async (user: Address) => {
        if (!contract) return null;
        try {
            const details = await contract.read.users([user]);
            return {
                email: details[0],
                isShopper: details[2],
                isBusinessOwner: details[3],
                totalPoints: Number(details[4]),
                tier: Number(details[5]),
                referrals: Number(details[6]),
            };
        } catch (error) {
            console.error("Error getting user details:", error);
            return null;
        }
    }, [contract]);

    const getStoreDetails = useCallback(async (store: Address) => {
        if (!contract) return null;
        try {
            const details = await contract.read.stores([store]);
            return {
                name: details[0],
                owner: details[1],
                isActive: details[2],
            };
        } catch (error) {
            console.error("Error getting store details:", error);
            return null;
        }
    }, [contract]);

    const getGiftCardDetails = useCallback(async (giftCardId: number) => {
        if (!contract) return null;
        try {
            const details = await contract.read.giftCards([BigInt(giftCardId)]);
            return {
                id: Number(details[0]),
                storeAddress: details[1],
                value: formatEther(details[2]),
                pointCost: Number(details[3]),
                isActive: details[4],
            };
        } catch (error) {
            console.error("Error getting gift card details:", error);
            return null;
        }
    }, [contract]);

    return {
        address,
        contract,
        registerUser,
        registerStore,
        purchaseAndEarnRewards,
        referProduct,
        createGiftCard,
        awardGiftCard,
        getStorePoints,
        getTotalPoints,
        getUserDetails,
        getStoreDetails,
        getGiftCardDetails,
    };
};