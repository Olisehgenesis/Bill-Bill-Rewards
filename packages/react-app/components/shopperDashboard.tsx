import React, { useState, useEffect } from "react";
import { Address } from "viem";
import { FaUserPlus, FaShoppingCart, FaShare, FaInfoCircle, FaCoins, FaStore, FaQrcode } from "react-icons/fa";
import { checkCUSDBalance } from "../contexts/checkUSDBalance";
import {
    createPublicClient,
    createWalletClient,
    custom,
    getContract,
    http,
    parseEther,
} from "viem";

import { celoAlfajores } from "viem/chains";
interface ShopperDashboardProps {
    address: Address | null;
    registerUser: (email: string, password: string, isShopper: boolean, isBusinessOwner: boolean) => Promise<void>;
    purchaseAndEarnRewards: (store: Address, amount: string) => Promise<void>;
    referProduct: (referredUser: Address) => Promise<void>;
    getStorePoints: (user: Address, store: Address) => Promise<number | null>;
    getTotalPoints: (user: Address) => Promise<number | null>;
    getUserDetails: (user: Address) => Promise<any>;
    listUserGiftCards: (user: Address) => Promise<number[]>;
    getUserTier: (user: Address) => Promise<number>;
}

const ShopperDashboard: React.FC<ShopperDashboardProps> = ({
    address,
    registerUser,
    purchaseAndEarnRewards,
    referProduct,
    getStorePoints,
    getTotalPoints,
    getUserDetails,
    listUserGiftCards,
    getUserTier
}) => {
    const [balance, setBalance] = useState<string>("");
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isShopper, setIsShopper] = useState<boolean>(true);
    const [isBusinessOwner, setIsBusinessOwner] = useState<boolean>(false);
    const [purchaseAmount, setPurchaseAmount] = useState<string>("");
    const [storeAddress, setStoreAddress] = useState<string>("");
    const [referralAddress, setReferralAddress] = useState<string>("");
    const [giftCards, setGiftCards] = useState<number[]>([]);
    const [userTier, setUserTier] = useState<number>(0);
    const [showShops, setShowShops] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [scannedAddress, setScannedAddress] = useState("");
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    
    useEffect(() => {
        const fetchData = async () => {
            let walletClient = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });
            let [address] = await walletClient.getAddresses();
            if (address) {
                const details = await getUserDetails(address);
                alert(details);
                if (details[0] !== '') {
                    alert("User already registered");
                    setUserDetails(details);
                    setIsRegistered(true);
                    const userBalance = await checkCUSDBalance(address as string);
                    setBalance(userBalance);
                    const points = await getTotalPoints(address);
                    setTotalPoints(points || 0);
                    const userGiftCards = await listUserGiftCards(address);
                    setGiftCards(userGiftCards);
                    const tier = await getUserTier(address);
                    setUserTier(tier);
                }
            }
        };
    
        fetchData();
    }, [address, getTotalPoints, getUserDetails, listUserGiftCards, getUserTier]);

    
    const handleRegister = async () => {
        try {
            
            await registerUser(email, password, isShopper, isBusinessOwner);
            if (address) {
               
                const details = await getUserDetails(address);
                setUserDetails(details);
                setIsRegistered(true);  // Add this line
            }
        } catch (error) {
            console.error("Error registering user:", error);
            alert(error);
        }
    };
    const handlePurchase = async () => {
        try {
            await purchaseAndEarnRewards(storeAddress as Address, purchaseAmount);
            alert("Purchase successful and rewards earned!");
            setShowPurchaseModal(false);
        } catch (error) {
            console.error("Error making purchase:", error);
            alert(error);
        }
    };

    const handleReferral = async () => {
        try {
            await referProduct(referralAddress as Address);
            alert("Referral successful!");
        } catch (error) {
            console.error("Error making referral:", error);
            alert("Failed to make referral. Please try again.");
        }
    };

    const handleQuickPay = () => {
        setShowQRScanner(true);
    };

    const handleQRCodeScanned = (result) => {
        setScannedAddress(result);
        setShowQRScanner(false);
        setShowPurchaseModal(true);
    };

    if (!isRegistered) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Shopper Registration</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Register User</h3>
                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border rounded-md"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border rounded-md"
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isShopper}
                                onChange={(e) => setIsShopper(e.target.checked)}
                                id="isShopper"
                            />
                            <label htmlFor="isShopper">Register as Shopper</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isBusinessOwner}
                                onChange={(e) => setIsBusinessOwner(e.target.checked)}
                                id="isBusinessOwner"
                            />
                            <label htmlFor="isBusinessOwner">Register as Business Owner</label>
                        </div>
                        <button
                            onClick={handleRegister}
                            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
                        >
                            <FaUserPlus className="mr-2" />
                            Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Shopper Dashboard</h2>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex-1 bg-white p-4 rounded-lg shadow-md mr-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaInfoCircle className="text-blue-600 text-2xl mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
                                <p className="text-2xl font-bold text-blue-600">{balance} cUSD</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaCoins className="text-yellow-500 text-2xl mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Total Points</h3>
                                <p className="text-2xl font-bold text-yellow-500">{totalPoints}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mb-6">
                <button
                    onClick={() => setShowShops(true)}
                    className="flex-1 mr-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                    <FaStore className="mr-2" />
                    Available Shops
                </button>
                <button
                    onClick={handleQuickPay}
                    className="flex-1 ml-2 p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
                >
                    <FaQrcode className="mr-2" />
                    Quick Pay (Scan QR)
                </button>
            </div>

            <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-gray-800">User Details</h3>
                <div className="grid grid-cols-2 gap-2">
                    
                    <p><span className="font-semibold">Email:</span> {userDetails[0]}</p>
                    <p><span className="font-semibold">Tier:</span> {userTier}</p>
                    <p><span className="font-semibold">Total Points:</span>{totalPoints}</p>
                    <p><span className="font-semibold">Referrals:</span> {userDetails[3]}</p>
                </div>
            </div>

            <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Available Gift Cards</h3>
                {giftCards.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {giftCards.map((giftCardId) => (
                            <li key={giftCardId}>Gift Card ID: {giftCardId}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No gift cards available.</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Refer a Friend</h3>
                    <input
                        type="text"
                        placeholder="Friend's Address"
                        value={referralAddress}
                        onChange={(e) => setReferralAddress(e.target.value)}
                        className="p-2 border rounded-md w-full mb-2"
                    />
                    <button
                        onClick={handleReferral}
                        className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 w-full flex items-center justify-center"
                    >
                        <FaShare className="mr-2" />
                        Refer
                    </button>
                </div>
            </div>

            {showShops && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Available Shops</h3>
                        {/* Add shop list here */}
                        <a href="/shops" onClick={() => setShowShops(false)}  // Ensure modal closes when link is clicked className="mt-4 p-2 bg-red-600 text-white rounded-md inline-block"
>
    Go to Shops
</a>
                    </div>
                </div>
            )}

            {showQRScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Scan QR Code</h3>
                        {/* Add QR code scanner component here */}
                        <button onClick={() => setShowQRScanner(false)} className="mt-4 p-2 bg-red-600 text-white rounded-md">Cancel</button>
                    </div>
                </div>
            )}

            {showPurchaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Make a Purchase</h3>
                        <input
                            type="text"
                            placeholder="Amount"
                            value={purchaseAmount}
                            onChange={(e) => setPurchaseAmount(e.target.value)}
                            className="p-2 border rounded-md w-full mb-4"
                        />
                        <button
                            onClick={handlePurchase}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 w-full flex items-center justify-center"
                        >
                            <FaShoppingCart className="mr-2" />
                            Purchase
                        </button>
                        <button onClick={() => setShowPurchaseModal(false)} className="mt-4 p-2 bg-red-600 text-white rounded-md w-full">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopperDashboard;