import React, { useState } from "react";
import OwnerDashboard from "./ownerDashboard";
import ShopperDashboard from "./shopperDashboard";
import { useRewardTribe } from "../contexts/useRewardTribe";
import { Switch } from "@headlessui/react";

const Dashboard: React.FC = () => {
    const [isOwner, setIsOwner] = useState(true);
    const {
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
        listUserGiftCards,
        getUserTier
    } = useRewardTribe();

    const toggleDashboard = () => {
        setIsOwner(!isOwner);
    };

    return (
        <div className="dashboard p-4">
            <div className="flex items-center justify-end mb-4">
                <span className="mr-3 text-sm font-medium text-gray-900">
                    {isOwner ? "My Shop" : "Shopper"}
                </span>
                <Switch
                    checked={isOwner}
                    onChange={toggleDashboard}
                    className={`${
                        isOwner ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                    <span
                        className={`${
                            isOwner ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </Switch>
            </div>
            {isOwner ? (
                <OwnerDashboard
                    address={address}
                    registerUser={registerUser}
                    registerStore={registerStore}
                    createGiftCard={createGiftCard}
                    awardGiftCard={awardGiftCard}
                    getStoreDetails={getStoreDetails}
                    getGiftCardDetails={getGiftCardDetails}
                    getTotalPoints={getTotalPoints}
                    listUserGiftCards={listUserGiftCards}
                />
            ) : (
                <ShopperDashboard
                    address={address}
                    registerUser={registerUser}
                    purchaseAndEarnRewards={purchaseAndEarnRewards}
                    referProduct={referProduct}
                    getStorePoints={getStorePoints}
                    getTotalPoints={getTotalPoints}
                    getUserDetails={getUserDetails}
                    listUserGiftCards={listUserGiftCards}
                    getUserTier={getUserTier}
                />
            )}
        </div>
    );
};

export default Dashboard;