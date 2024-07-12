import { useState, useCallback } from "react";
import BillBuddyRewardsABI from "../contexts/RewardTribe-abi.json";
import {
    createPublicClient,
    createWalletClient,
    custom,
    getContract,
    http,
    parseEther,
} from "viem";
import { celoAlfajores } from "viem/chains";
import { env } from "process";

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});
//load variables from .env
const variables = {
    "TESTNET": {
        "REWARD_TRIBE_ADDRESS": env.REWARD_TRIBE_ADDRESS_TESTNET,
        "cUSDTokenAddress": env.cUSDTokenAddress_TESTNET
    },
    "MAINNET": {
        "REWARD_TRIBE_ADDRESS": env.REWARD_TRIBE_ADDRESS_MAINNET,
        "cUSDTokenAddress": env.cUSDTokenAddress_MAINNET
    }
}

const environment = env.NODE_ENV as "TESTNET" | "MAINNET";



const REWARD_TRIBE_ADDRESS_TESTNET = variables[environment]["REWARD_TRIBE_ADDRESS"];
const cUSDTokenAddress = variables[environment]["cUSDTokenAddress"];
export const useRewardTribe = () => {
    const [address, setAddress] = useState<string | null>(null);

    const getUserAddress = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            let walletClient = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });

            let [address] = await walletClient.getAddresses();
            setAddress(address);
        }
    };

    const registerUser = useCallback(async (email: string, password: string, isShopper: boolean, isBusinessOwner: boolean) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            abi: BillBuddyRewardsABI,
            functionName: "registerUser",
            account: address,
            args: [email, password, isShopper, isBusinessOwner],
            feeCurrency: cUSDTokenAddress,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    }, []);

    const registerStore = useCallback(async (name: string) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            abi: BillBuddyRewardsABI,
            functionName: "registerStore",
            account: address,
            args: [name],
            feeCurrency: cUSDTokenAddress,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    }, []);

    const purchaseAndEarnRewards = useCallback(async (storeAddress: string, amount: string) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const amountInWei = parseEther(amount);

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            abi: BillBuddyRewardsABI,
            functionName: "purchaseAndEarnRewards",
            account: address,
            args: [storeAddress, amountInWei],
            feeCurrency: cUSDTokenAddress,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    }, []);

    const createGiftCard = useCallback(async (value: string, pointCost: number, quality: number) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const valueInWei = parseEther(value);

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            abi: BillBuddyRewardsABI,
            functionName: "createGiftCard",
            account: address,
            args: [valueInWei, pointCost, quality],
            feeCurrency: cUSDTokenAddress,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    }, []);
    const awardGiftCard = useCallback(async (giftCardId: number, recipient: string) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            abi: BillBuddyRewardsABI,
            functionName: "awardGiftCard",
            account: address,
            args: [giftCardId, recipient],
            feeCurrency: cUSDTokenAddress,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    }, []);

    const getStorePoints = useCallback(async (user: string, store: string) => {
        const billBuddyContract = getContract({
            abi: BillBuddyRewardsABI,
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            client: publicClient,
        });

        const points = await billBuddyContract.read.getStorePoints([user, store]);
        return points;
    }, []);
    const getUserTier = useCallback(async (user: string) => {
        // Placeholder implementation
        // You should implement a tier system in your contract
        return 1; // Default tier
    }, []);

    const mintRoyaltyGiftCard = useCallback(async (giftCardId: number) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            abi: BillBuddyRewardsABI,
            functionName: "mintRoyaltyGiftCard",
            account: address,
            args: [giftCardId],
            feeCurrency: cUSDTokenAddress,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    }, []);

    const referProduct = useCallback(async (referredUser: string) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            abi: BillBuddyRewardsABI,
            functionName: "referProduct",
            account: address,
            args: [referredUser],
            feeCurrency: cUSDTokenAddress,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    }, []);

    const getUserDetails = useCallback(async (userAddress: string) => {
        const billBuddyContract = getContract({
            abi: BillBuddyRewardsABI,
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            client: publicClient,
        });

        const userDetails = await billBuddyContract.read.getUserDetails([userAddress]);
        return userDetails;
    }, []);

    const getAllStores = useCallback(async () => {
        const billBuddyContract = getContract({
            abi: BillBuddyRewardsABI,
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            client: publicClient,
        });

        const stores = await billBuddyContract.read.getAllStores();
        return stores;
    }, []);

    const getGiftCardDetails = useCallback(async (giftCardId: number) => {
        const billBuddyContract = getContract({
            abi: BillBuddyRewardsABI,
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            client: publicClient,
        });

        const giftCardDetails = await billBuddyContract.read.getGiftCardDetails([giftCardId]);
        return giftCardDetails;
    }, []);
    const getTotalPoints = useCallback(async (user: string) => {
        const billBuddyContract = getContract({
            abi: BillBuddyRewardsABI,
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            client: publicClient,
        });

        const points = await billBuddyContract.read.getTotalPoints([user]);
        return points;
    }, []);

    const listUserGiftCards = useCallback(async (userAddress: string) => {
        const billBuddyContract = getContract({
            abi: BillBuddyRewardsABI,
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            client: publicClient,
        });

        const userGiftCards = await billBuddyContract.read.listUserGiftCards([userAddress]);
        return userGiftCards;
    }, []);
    const getStoreDetails = useCallback(async (storeAddress: string) => {
        const billBuddyContract = getContract({
            abi: BillBuddyRewardsABI,
            address: REWARD_TRIBE_ADDRESS_TESTNET
            ,
            client: publicClient,
        });

        const storeDetails = await billBuddyContract.read.stores([storeAddress]);
        return storeDetails;
    }, []);

    return {
        address,
        getUserAddress,
        registerUser,
        registerStore,
        purchaseAndEarnRewards,
        createGiftCard,
        mintRoyaltyGiftCard,
        referProduct,
        getUserDetails,
        getAllStores,
        getGiftCardDetails,
        listUserGiftCards,
        awardGiftCard,
        getStorePoints,
        getTotalPoints,
        getStoreDetails,
        getUserTier,
    };
};