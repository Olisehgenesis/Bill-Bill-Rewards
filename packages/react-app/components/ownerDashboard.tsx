import React, { useState, useEffect } from "react";
import { Address } from "viem";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    FaStore,
    FaGift,
    FaAward,
    FaInfoCircle,
    FaPlusCircle,
    FaUserPlus,
    FaChartLine,
    FaEdit,
} from "react-icons/fa";
import { checkCUSDBalance } from "../contexts/checkUSDBalance";
const RegisterStoreForm = ({ onRegister, onClose }) => {
    const [storeData, setStoreData] = useState({
      name: '',
      description: '',
      phoneNumber: '',
      email: '',
      physicalLocation: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setStoreData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onRegister(storeData);
    };
  
    return (
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
  
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Register Store
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-2">
                    <input
                      type="text"
                      name="name"
                      value={storeData.name}
                      onChange={handleChange}
                      placeholder="Store Name"
                      className="w-full p-2 border rounded mb-2"
                      required
                    />
                    <input
                      type="text"
                      name="description"
                      value={storeData.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={storeData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="email"
                      name="email"
                      value={storeData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="physicalLocation"
                      value={storeData.physicalLocation}
                      onChange={handleChange}
                      placeholder="Physical Location"
                      className="w-full p-2 border rounded mb-2"
                    />
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };
  

interface OwnerDashboardProps {
    address: Address | null;
    registerStore: (name: string, description: string, phoneNumber: string, email: string, physicalLocation: string) => Promise<void>;
    createGiftCard: (value: string, pointCost: number) => Promise<void>;
    awardGiftCard: (giftCardId: number, recipient: Address) => Promise<void>;
    getStoreDetails: (store: Address) => Promise<any>;
    updateStoreDetails: (name: string, description: string, phoneNumber: string, email: string, physicalLocation: string) => Promise<void>;
    getGiftCardDetails: (giftCardId: number) => Promise<any>;
    getTotalPoints?: (user: Address) => Promise<number | null>;
    addEmployee: (employeeAddress: Address) => Promise<void>;
    getBusinessStats: () => Promise<any>;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
    address,
    registerStore,
    createGiftCard,
    awardGiftCard,
    getStoreDetails,
    updateStoreDetails,
    getGiftCardDetails,
    getTotalPoints,
    addEmployee,
    getBusinessStats,
}) => {
    const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
    const [editStoreName, setEditStoreName] = useState("");
    const [editStoreDescription, setEditStoreDescription] = useState("");
    const [editStorePhoneNumber, setEditStorePhoneNumber] = useState("");
    const [editStoreEmail, setEditStoreEmail] = useState("");
    const [editStorePhysicalLocation, setEditStorePhysicalLocation] = useState("");
    const [balance, setBalance] = useState<string>("");
    const [points, setPoints] = useState<number>(0);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [storeDetails, setStoreDetails] = useState<any>(null);
    const [giftCards, setGiftCards] = useState<any[]>([]);
    const [businessStats, setBusinessStats] = useState<any>(null);
    //data for register store modal as dict
    const [newStoreData, setNewStoreData] = useState<any>(null);

    const [isRegisterStoreModalOpen, setIsRegisterStoreModalOpen] = useState(false);
    const [isCreateGiftCardModalOpen, setIsCreateGiftCardModalOpen] = useState(false);
    const [isAwardGiftCardModalOpen, setIsAwardGiftCardModalOpen] = useState(false);

    const [newStoreName, setNewStoreName] = useState<string>("");
    const [newGiftCardValue, setNewGiftCardValue] = useState<string>("");
    const [newGiftCardPointCost, setNewGiftCardPointCost] = useState<number>(0);
    const [awardGiftCardId, setAwardGiftCardId] = useState<number>(0);
    const [awardGiftCardRecipient, setAwardGiftCardRecipient] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (address) {
                try {
                    const userBalance = await checkCUSDBalance(address as string);
                    setBalance(userBalance);

                    if (getTotalPoints) {
                        const userPoints = await getTotalPoints(address);
                        setPoints(userPoints || 0);
                        
                        const businessPoints = await getTotalPoints(address);
                        setTotalPoints(businessPoints || 0);
                    }

                    const details = await getStoreDetails(address);
                    setStoreDetails(details);

                    const stats = await getBusinessStats();
                    setBusinessStats(stats);

                    // Fetch gift cards (assuming there's a function to get all gift cards)
                    // const cards = await getAllGiftCards();
                    // setGiftCards(cards);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [address, getTotalPoints, getStoreDetails, getBusinessStats]);
  
    
    const handleRegisterStore = async () => {
        if (newStoreData) {
            try {
                //await registerStore(newStoreData.name, newStoreData. ); // Add empty strings for new fields
                setNewStoreName("");
                setIsRegisterStoreModalOpen(false);
                // Refresh store details
                if (address) {
                    const details = await getStoreDetails(address);
                    setStoreDetails(details);
                }
            } catch (error) {
                console.error("Error registering store:", error);
            }
        }
    };

    const handleCreateGiftCard = async () => {
        if (newGiftCardValue && newGiftCardPointCost) {
            try {
                await createGiftCard(newGiftCardValue, newGiftCardPointCost);
                setNewGiftCardValue("");
                setNewGiftCardPointCost(0);
                setIsCreateGiftCardModalOpen(false);
                // Refresh gift cards
                // const cards = await getAllGiftCards();
                // setGiftCards(cards);
            } catch (error) {
                console.error("Error creating gift card:", error);
            }
        }
    };

    const handleAwardGiftCard = async () => {
        if (awardGiftCardId && awardGiftCardRecipient) {
            try {
                await awardGiftCard(awardGiftCardId, awardGiftCardRecipient as Address);
                setAwardGiftCardId(0);
                setAwardGiftCardRecipient("");
                setIsAwardGiftCardModalOpen(false);
            } catch (error) {
                console.error("Error awarding gift card:", error);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Owner Dashboard</h2>
            
            {/* Balance, Points, and Business Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <FaInfoCircle className="text-blue-500 mr-3 text-xl" />
                        <h3 className="text-xl font-semibold text-gray-700">Balance</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{balance} cUSD</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <FaAward className="text-green-500 mr-3 text-xl" />
                        <h3 className="text-xl font-semibold text-gray-700">Points Accumulated</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{points}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <FaStore className="text-purple-500 mr-3 text-xl" />
                        <h3 className="text-xl font-semibold text-gray-700">Total Business Points</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalPoints}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button onClick={() => setIsRegisterStoreModalOpen(true)}>Register Store</button>
      
      {isRegisterStoreModalOpen && (
        <RegisterStoreForm
          onRegister={handleRegisterStore}
          onClose={() => setIsRegisterStoreModalOpen(false)}
        />
      )}
                <button
                    onClick={() => setIsCreateGiftCardModalOpen(true)}
                    className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
                >
                    <FaGift className="mr-2" />
                    Create Gift Card
                </button>
                <button
                    onClick={() => setIsAwardGiftCardModalOpen(true)}
                    className="bg-purple-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-purple-600 transition duration-300 flex items-center justify-center"
                >
                    <FaAward className="mr-2" />
                    Award Gift Card
                </button>
            </div>

            {/* Store Details Section */}
            {storeDetails && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Store Details</h3>
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {storeDetails.name}</p>
                    <p className="text-gray-700"><span className="font-semibold">Address:</span> {storeDetails.address}</p>
                    <p className="text-gray-700"><span className="font-semibold">Employees:</span> {storeDetails.employees?.join(", ")}</p>
                </div>
            )}

            {/* Business Stats Section */}
            {businessStats && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Business Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-700">Total Transactions</h4>
                            <p className="text-2xl font-bold text-gray-900">{businessStats.totalTransactions}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Total Revenue</h4>
                            <p className="text-2xl font-bold text-gray-900">{businessStats.totalRevenue} cUSD</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Active Gift Cards</h4>
                            <p className="text-2xl font-bold text-gray-900">{businessStats.activeGiftCards}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Register Store Modal */}
            <Transition appear show={isEditStoreModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsEditStoreModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Edit Store Details
                                    </Dialog.Title>
                                    <div className="mt-2">
                                    <form onSubmit={handleSubmit} className="mt-2">
                  <input
                    type="text"
                    name="name"
                    value={storeData.name}
                    onChange={handleChange}
                    placeholder="Store Name"
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  <input
                    type="text"
                    name="description"
                    value={storeData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={storeData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="email"
                    name="email"
                    value={storeData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    name="physicalLocation"
                    value={storeData.physicalLocation}
                    onChange={handleChange}
                    placeholder="Physical Location"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Register
                    </button>
                  </div>
                </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Create Gift Card Modal */}
            <Transition appear show={isCreateGiftCardModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsCreateGiftCardModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Create Gift Card
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={newGiftCardValue}
                                            onChange={(e) => setNewGiftCardValue(e.target.value)}
                                            placeholder="Gift Card Value"
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        <input
                                            type="number"
                                            value={newGiftCardPointCost}
                                            onChange={(e) => setNewGiftCardPointCost(Number(e.target.value))}
                                            placeholder="Point Cost"
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                            onClick={handleCreateGiftCard}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Award Gift Card Modal */}
            <Transition appear show={isAwardGiftCardModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsAwardGiftCardModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Award Gift Card
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            value={awardGiftCardId}
                                            onChange={(e) => setAwardGiftCardId(Number(e.target.value))}
                                            placeholder="Gift Card ID"
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={awardGiftCardRecipient}
                                            onChange={(e) => setAwardGiftCardRecipient(e.target.value)}
                                            placeholder="Recipient Address"
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                                            onClick={handleAwardGiftCard}
                                        >
                                            Award
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Gift Cards Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Gift Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {giftCards.map((card) => (
                        <div key={card.id} className="bg-gray-100 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-700">Gift Card #{card.id}</h4>
                            <p className="text-gray-600">Value: {card.value} cUSD</p>
                            <p className="text-gray-600">Point Cost: {card.pointCost}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;