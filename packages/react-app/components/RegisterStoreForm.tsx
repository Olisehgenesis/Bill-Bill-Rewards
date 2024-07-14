import React, { useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface StoreData {
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  physicalLocation: string;
}

interface RegisterStoreFormProps {
  onRegister: (data: StoreData) => void;
  onClose: () => void;
}

const RegisterStoreForm: React.FC<RegisterStoreFormProps> = ({ onRegister, onClose }) => {
  const [StoreData, setStoreData
  ] = useState({
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    physicalLocation: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!StoreData
.name.trim()) newErrors.name = "Store name is required";
    if (!StoreData
.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(StoreData
.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!StoreData
.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(StoreData
.phoneNumber.replace(/\D/g,''))) {
      newErrors.phoneNumber = "Phone number is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Registartions started")
      onRegister(StoreData);
      //if form invalid
    } else {
      alert("Form invalid")
    }
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
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Register Store
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={StoreData
                  .name}
                      onChange={handleChange}
                      placeholder="Store Name"
                      className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <textarea
                      name="description"
                      value={StoreData
                  .description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={StoreData
                  .phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className={`w-full p-2 border rounded ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={StoreData
                  .email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="physicalLocation"
                      value={StoreData
                  .physicalLocation}
                      onChange={handleChange}
                      placeholder="Physical Location"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    >
                      Cancel
                    </button>
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

export default RegisterStoreForm;