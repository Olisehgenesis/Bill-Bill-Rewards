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
const CONTRACT_ADDRESS = "0x321600d595340eEE40dA5e932d97AfeA616898dd" as Address;
const USDC_ADAPTER_MAINNET = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" as Address;

export const useBillBillyRewards = () => {
    const [address, setAddress] = useState<Address | null>(null);

    const getUserAddress = useCallback(async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            const walletClient = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });

            const [address] = await walletClient.getAddresses();
            setAddress(address);
        }
    }, []);

    useEffect(() => {
        getUserAddress();
    }, [getUserAddress]);

    const registerUser = useCallback(async (email: string, password: string, isShopper: boolean, isBusinessOwner: boolean) => {

        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });
        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "registerUser",
            account: address,
            args: [email, password, isShopper, isBusinessOwner],
            feeCurrency: USDC_ADAPTER_MAINNET,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        return receipt;
    }, [address]);

    const registerStore = useCallback(async (name: string) => {
        console.log("registering store with name:", name);
        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,

        });
        let [address] = await walletClient.getAddresses();
        console.log(address);

        const tx = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "registerStore",
            account: address,
            args: [name],
            feeCurrency: USDC_ADAPTER_MAINNET,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log(receipt);
        return receipt;
    }, [address]);

    const purchaseAndEarnRewards = useCallback(async (store: Address, amount: string) => {
        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });
        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "purchaseAndEarnRewards",
            account: address,
            args: [store, parseEther(amount)],
            feeCurrency: USDC_ADAPTER_MAINNET,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        return receipt;
    }, [address]);

    const referProduct = useCallback(async (referredUser: Address) => {
        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });
        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "referProduct",
            account: address,
            args: [referredUser],
            feeCurrency: USDC_ADAPTER_MAINNET
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        return receipt;
    }, [address]);

    const createGiftCard = useCallback(async (value: string, pointCost: number) => {

        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });
        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "createGiftCard",
            account: address,
            args: [parseEther(value), BigInt(pointCost)],
            feeCurrency: USDC_ADAPTER_MAINNET

        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        return receipt;
    }, [address]);

    const awardGiftCard = useCallback(async (giftCardId: number, recipient: Address) => {

        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });
        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "awardGiftCard",
            account: address,
            args: [BigInt(giftCardId), recipient],
            feeCurrency: USDC_ADAPTER_MAINNET
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        return receipt;
    }, [address]);

    const getStorePoints = useCallback(async (user: Address, store: Address) => {


        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });
        let [address] = await walletClient.getAddresses();

        const contract = getContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            client: walletClient,
        });

        const points = await contract.read.getStorePoints([user, store]);
        return Number(points);
    }, [address]);

    const getTotalPoints = useCallback(async (user: Address) => {

        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const contract = getContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            client: walletClient,
        });

        const points = await contract.read.getTotalPoints([user]);
        return Number(points);
    }, [address]);

    const getUserDetails = useCallback(async (user: Address) => {
        if (!address) return null;

        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const contract = getContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            client: walletClient,
        });

        const details = await contract.read.users([user]);
        return {
            email: details[0],
            isShopper: details[2],
            isBusinessOwner: details[3],
            totalPoints: Number(details[4]),
            tier: Number(details[5]),
            referrals: Number(details[6]),
        };
    }, [address]);

    const getStoreDetails = useCallback(async (store: Address) => {
        if (!address) return null;

        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const contract = getContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            client: walletClient,
        });

        const details = await contract.read.stores([store]);
        return {
            name: details[0],
            owner: details[1],
            isActive: details[2],
        };
    }, [address]);

    const getGiftCardDetails = useCallback(async (giftCardId: number) => {
        if (!address) return null;

        const walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const contract = getContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            client: walletClient,
        });

        const details = await contract.read.giftCards([BigInt(giftCardId)]);
        return {
            id: Number(details[0]),
            storeAddress: details[1],
            value: formatEther(details[2]),
            pointCost: Number(details[3]),
            isActive: details[4],
        };
    }, [address]);

    return {
        address,
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
