import React from 'react';
import { FaStore, FaShoppingCart } from 'react-icons/fa';

// Mock data for shops (replace this with actual data from your backend)
const shopData = [
  { id: 1, name: 'Grocery Store', address: '0x1234...5678', description: 'Fresh produce and everyday essentials' },
  { id: 2, name: 'Electronics Hub', address: '0x2345...6789', description: 'Latest gadgets and tech accessories' },
  { id: 3, name: 'Fashion Boutique', address: '0x3456...7890', description: 'Trendy clothing and accessories' },
  { id: 4, name: 'Home Decor', address: '0x4567...8901', description: 'Beautiful items for your living space' },
];

function Shops() {
  const handlePay = (shopAddress: string) => {
    // Implement payment logic here
    console.log(`Initiating payment to shop: ${shopAddress}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 border-2 border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <FaStore className="inline-block mr-2 mb-1" />
        Available Shops
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {shopData.map((shop) => (
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
