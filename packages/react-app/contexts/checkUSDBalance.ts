import { getContract, formatEther, createPublicClient, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stableTokenABI } from "@celo/abis";

const STABLE_TOKEN_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
}); // Testnet

export const checkCUSDBalance = async (address: string): Promise<string> => {
    const StableTokenContract = getContract({
        abi: stableTokenABI,
        address: STABLE_TOKEN_ADDRESS,
        client: publicClient,
    });

    const balanceInBigNumber = await StableTokenContract.read.balanceOf([
        address,
    ]);

    const balanceInWei = balanceInBigNumber.toString();

    const balanceInEthers = formatEther(balanceInWei);

    return balanceInEthers;
};
