import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { toast } from 'react-toastify';

import santimLogo from '../../assets/santimPay.jpg';
import chapaLogo from '../../assets/chapa.jpg';

const campusOptions = {
  Main: ['Building 1', 'Building 2', 'Building 3', 'DMC', 'AMEL'],
  HiT: ['Engineering A', 'Engineering B', 'ICT Center'],
  CVM: ['Vet Clinic', 'Lecture Hall 1', 'Admin Block'],
};

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const CartItem = ({ item, onInc, onDec, onRemove, BASE_URL }) => (
  <div className="flex items-center justify-between p-4 mb-4 bg-base-300 shadow-lg rounded-lg">
    <div className="flex items-center gap-4">
      <img src={`${BASE_URL}${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <span className="text-xl text-amber-500 font-bold">{item.price} ETB</span>
        <p className="text-sm">Quantity: {item.quantity}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button onClick={() => onDec(item._id)} className="btn btn-sm btn-ghost text-xl text-red-500"><FaMinus /></button>
        <span className="text-lg">{item.quantity}</span>
        <button onClick={() => onInc(item._id)} className="btn btn-sm btn-ghost text-xl text-green-500"><FaPlus /></button>
      </div>
      <button onClick={() => onRemove(item._id)} className="btn btn-sm btn-ghost text-xl text-red-500"><FaTrashAlt /></button>
    </div>
  </div>
);

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [cartItems, setCartItems] = useState((state?.items || []).map(i => ({ ...i, quantity: i.quantity || 1 })));
  const [campus, setCampus] = useState('');
  const [building, setBuilding] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!loading && (!user || user.role !== 'customer')) navigate('/login');
  }, [user, loading, navigate]);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item => item._id === id ? { ...item, quantity: item.quantity + delta } : item).filter(i => i.quantity > 0)
    );
  };

  const handleChapaPayment = async () => {
    if (!campus || !building || !roomNumber) {
      return toast.error('Please fill in all delivery information.');
    }

    setIsProcessingPayment(true);
    
    try {
      const orderItems = cartItems.map(({ _id, quantity }) => ({ menuId: _id, quantity }));
      
      const response = await fetch(api.createOrder, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          ...getAuthHeader() 
        },
        body: JSON.stringify({ 
          items: orderItems, 
          campus, 
          building, 
          roomNumber 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Redirect to Chapa payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment processing failed');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="px-4 sm:px-[5%] lg:px-[15%] py-22">
      <h2 className="text-2xl font-semibold text-center mb-6">Checkout</h2>

      {!cartItems.length ? (
        <p className="text-center text-xl text-gray-600">You have nothing to order</p>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem
              key={item._id}
              item={item}
              onInc={() => updateQuantity(item._id, 1)}
              onDec={() => updateQuantity(item._id, -1)}
              onRemove={() => setCartItems(prev => prev.filter(i => i._id !== item._id))}
              BASE_URL={BASE_URL}
            />
          ))}

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <span className="text-2xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-amber-500">{totalPrice.toFixed(2)} ETB</span>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>

            <select 
              className="select select-bordered w-full mb-3" 
              value={campus} 
              onChange={e => { 
                setCampus(e.target.value); 
                setBuilding(''); 
              }}
            >
              <option value="">Select Campus</option>
              {Object.keys(campusOptions).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select 
              className="select select-bordered w-full mb-3" 
              value={building} 
              onChange={e => setBuilding(e.target.value)} 
              disabled={!campus}
            >
              <option value="">Select Building</option>
              {campusOptions[campus]?.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <input 
              className="input input-bordered w-full mb-3" 
              placeholder="Room Number" 
              value={roomNumber} 
              onChange={e => setRoomNumber(e.target.value)} 
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button className="btn bg-white w-full h-14 sm:w-[48%] flex items-center justify-center gap-2 text-black">
              <img src={santimLogo} alt="Santim Pay" className="h-full" />
              Pay with Santim Pay
            </button>

            <button 
              onClick={handleChapaPayment} 
              className="btn bg-[#0d1b35] w-full h-14 sm:w-[48%] flex items-center justify-center gap-2 py-0.5 text-white"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <img src={chapaLogo} alt="Chapa" className="h-full" />
                  Pay with Chapa
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;