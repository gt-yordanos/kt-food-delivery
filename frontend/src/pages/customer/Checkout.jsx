import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { toast } from 'react-toastify'; // Import Toast

import santimLogo from '../../assets/santimPay.jpg';
import chapaLogo from '../../assets/chapa.jpg';

// Mock data for campuses and their buildings
const campusOptions = {
  Main: ['Building 1', 'Building 2', 'Building 3', 'DMC', 'AMEL'],
  HiT: ['Engineering A', 'Engineering B', 'ICT Center'],
  CVM: ['Vet Clinic', 'Lecture Hall 1', 'Admin Block'],
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { items } = location.state || {};
  const [cartItems, setCartItems] = useState(items || []);
  const [totalPrice, setTotalPrice] = useState(0);

  const [campus, setCampus] = useState('');
  const [building, setBuilding] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'customer') {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setCartItems((prevItems) =>
      prevItems.map(item => ({
        ...item,
        quantity: item.quantity || 1,
      }))
    );
  }, [items]);

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map(item => {
        if (item._id === id) item.quantity += 1;
        return item;
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map(item => {
        if (item._id === id && item.quantity > 1) item.quantity -= 1;
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== id));
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    if (!campus || !building || !roomNumber) {
      toast.error('Please fill in campus, building, and room number before placing the order.');
      return;
    }

    const orderItems = cartItems.map(item => ({
      menuId: item._id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch(api.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          items: orderItems,
          campus,
          building,
          roomNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const data = await response.json();
      toast.success('Order placed successfully!');
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="px-4 sm:px-[5%] lg:px-[15%] py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-xl text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 mb-4 bg-base-300 shadow-lg rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-xl text-amber-500 font-bold">{item.price} ETB.</span>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="btn btn-sm btn-ghost text-xl text-red-500"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="btn btn-sm btn-ghost text-xl text-green-500"
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="btn btn-sm btn-ghost text-xl text-red-500"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <span className="text-2xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-amber-500">{totalPrice.toFixed(2)} ETB</span>
          </div>

          {/* Delivery Form */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>

            <div className="mb-3">
              <label className="block font-medium mb-1">Campus</label>
              <select
                className="select select-bordered w-full"
                value={campus}
                onChange={(e) => {
                  setCampus(e.target.value);
                  setBuilding('');
                }}
              >
                <option value="">Select Campus</option>
                {Object.keys(campusOptions).map((campusName) => (
                  <option key={campusName} value={campusName}>
                    {campusName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">Building</label>
              <select
                className="select select-bordered w-full"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                disabled={!campus}
              >
                <option value="">Select Building</option>
                {campus &&
                  campusOptions[campus].map((bldg) => (
                    <option key={bldg} value={bldg}>
                      {bldg}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">Room Number</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g. 204"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button className="btn bg-white w-full h-14 sm:w-[48%] flex items-center justify-center gap-2 text-black">
              <img src={santimLogo} alt="Santim Pay" className="h-full" />
              Pay with Santim Pay
            </button>

            <button
              onClick={handlePlaceOrder}
              className="btn bg-[#0d1b35] w-full h-14 sm:w-[48%] flex items-center justify-center gap-2 py-0.5 text-white"
            >
              <img src={chapaLogo} alt="Chapa" className="h-full" />
              Pay with Chapa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;