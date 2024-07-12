/* eslint-disable react-hooks/exhaustive-deps */
import PrimaryButton from "@/components/Button";
import { useRewardTribe } from "@/contexts/useRewardTribe";
import  DashBoard  from "../components/Dashboard";
import { useEffect, useState } from "react";

export default function Home() {
    const { address, getUserDetails } = useRewardTribe();
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkRegistration() {
            if (address) {
                const userDetails = await getUserDetails(address);
                setIsRegistered(userDetails !== null);
            }
            setLoading(false);
        }
        checkRegistration();
    }, [address, getUserDetails]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* {isRegistered ? <DashBoard /> : <RegisterPage />} */}
            <DashBoard />
        </div>
    );
}