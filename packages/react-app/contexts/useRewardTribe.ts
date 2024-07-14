import { useState, useCallback } from "react";
import RewardTribeABI from "../contexts/RewardTribe-abi.json";
import {
    createPublicClient,
    createWalletClient,
    custom,
    getContract,
    http,
    parseEther,
} from "viem";
import { celoAlfajores } from "viem/chains";

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});



export const useRewardTribe = () => {
    const environment = process.env.NEXT_PUBLIC_ENV_MODE as "TESTNET" | "MAINNET";



    // environment = "TESTNET";

    const REWARD_TRIBE_ADDRESS = environment === "TESTNET"
        ? process.env.NEXT_PUBLIC_REWARD_TRIBE_ADDRESS_TESTNET as `0x${string}`
        : process.env.NEXT_PUBLIC_REWARD_TRIBE_ADDRESS_MAINNET as `0x${string}`;

    const cUSDTokenAddress = environment === "TESTNET"
        ? process.env.NEXT_PUBLIC_cUSDTokenAddress_TESTNET as `0x${string}`
        : process.env.NEXT_PUBLIC_cUSDTokenAddress_MAINNET as `0x${string}`;

    console.log("Reward Tribe Address: " + REWARD_TRIBE_ADDRESS);
    console.log("cUSD Token Address: " + cUSDTokenAddress);
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
            address: REWARD_TRIBE_ADDRESS
            ,
            abi: RewardTribeABI
            ,
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

    const registerStore = useCallback(async (
        name: string,
        description: string,
        phoneNumber: string,
        email: string,
        physicalLocation: string
    ) => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: REWARD_TRIBE_ADDRESS,
            abi: RewardTribeABI,
            functionName: "registerStore",
            account: address,
            args: [name, description, phoneNumber, email, physicalLocation],
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
            address: REWARD_TRIBE_ADDRESS
            ,
            abi: RewardTribeABI
            ,
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
            address: REWARD_TRIBE_ADDRESS
            ,
            abi: RewardTribeABI
            ,
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
            address: REWARD_TRIBE_ADDRESS
            ,
            abi: RewardTribeABI
            ,
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
        const RewardTribeContract = getContract({
            abi: RewardTribeABI
            ,
            address: REWARD_TRIBE_ADDRESS
            ,
            client: publicClient,
        });

        const points = await RewardTribeContract.read.getStorePoints([user, store]);
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
            address: REWARD_TRIBE_ADDRESS
            ,
            abi: RewardTribeABI
            ,
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
            address: REWARD_TRIBE_ADDRESS
            ,
            abi: RewardTribeABI
            ,
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
        const RewardTribeContract = getContract({
            abi: RewardTribeABI
            ,
            address: REWARD_TRIBE_ADDRESS
            ,
            client: publicClient,
        });
        const userDetails = await RewardTribeContract.read.getUserDetails([userAddress]);
        return userDetails;
    }, []);

    const getAllStores = useCallback(async () => {
        const RewardTribeContract = getContract({
            abi: RewardTribeABI
            ,
            address: REWARD_TRIBE_ADDRESS
            ,
            client: publicClient,
        });

        const stores = await RewardTribeContract.read.getAllStores();
        return stores;
    }, []);

    const getGiftCardDetails = useCallback(async (giftCardId: number) => {
        const RewardTribeContract = getContract({
            abi: RewardTribeABI
            ,
            address: REWARD_TRIBE_ADDRESS
            ,
            client: publicClient,
        });

        const giftCardDetails = await RewardTribeContract.read.getGiftCardDetails([giftCardId]);
        return giftCardDetails;
    }, []);
    const getTotalPoints = useCallback(async (user: string) => {
        const RewardTribeContract = getContract({
            abi: RewardTribeABI
            ,
            address: REWARD_TRIBE_ADDRESS
            ,
            client: publicClient,
        });

        const points = await RewardTribeContract.read.getTotalPoints([user]);
        return points;
    }, []);

    const listUserGiftCards = useCallback(async (userAddress: string) => {
        const RewardTribeContract = getContract({
            abi: RewardTribeABI
            ,
            address: REWARD_TRIBE_ADDRESS
            ,
            client: publicClient,
        });

        const userGiftCards = await RewardTribeContract.read.listUserGiftCards([userAddress]);
        return userGiftCards;
    }, []);
    const getStoreDetails = useCallback(async (storeAddress: string) => {
        const RewardTribeContract = getContract({
            abi: RewardTribeABI
            ,
            address: REWARD_TRIBE_ADDRESS
            ,
            client: publicClient,
        });

        const storeDetails = await RewardTribeContract.read.stores([storeAddress]);
        return storeDetails;
    }, []);

    return {
        address,
        REWARD_TRIBE_ADDRESS,
        cUSDTokenAddress,
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