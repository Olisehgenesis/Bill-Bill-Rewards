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
  const handlePay = (shopAddress) => {
    // Implement payment logic here
    console.log(`Initiating payment to shop: ${shopAddress}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        <FaStore className="inline-block mr-2 mb-1" />
        Available Shops
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopData.map((shop) => (
          <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{shop.name}</h2>
              <p className="text-gray-600 mb-4">{shop.description}</p>
              <p className="text-sm text-gray-500 mb-4">Address: {shop.address}</p>
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-end">
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