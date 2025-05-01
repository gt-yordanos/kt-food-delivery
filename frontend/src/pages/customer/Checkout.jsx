import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api'; // Import the API object

// Import logos from the assets folder
import santimLogo from '../../assets/santimPay.jpg';
import chapaLogo from '../../assets/chapa.jpg';

export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Get user from AuthContext
  const { items } = location.state || {}; // Get cart items passed via location state
  const [cartItems, setCartItems] = useState(items || []);
  const [totalPrice, setTotalPrice] = useState(0);

  // Check if user is logged in and if their role is customer
  useEffect(() => {
    if (loading) return; // Wait for loading to finish
    if (!user || user.role !== 'customer') {
      // Redirect to login page if not logged in or not a customer
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Ensure quantity is set for all items
  useEffect(() => {
    setCartItems((prevItems) =>
      prevItems.map(item => ({
        ...item,
        quantity: item.quantity || 1, // Ensure quantity is at least 1
      }))
    );
  }, [items]);

  // Function to increase quantity
  const increaseQuantity = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item._id === id) {
          item.quantity += 1; // Increase the quantity
        }
        return item;
      });
      return updatedItems;
    });
  };

  // Function to decrease quantity
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item._id === id && item.quantity > 1) {
          item.quantity -= 1; // Decrease the quantity (ensuring it's not less than 1)
        }
        return item;
      });
      return updatedItems;
    });
  };

  // Function to remove item from the cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== id));
  };

  // Function to calculate total price
  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  // Recalculate the total whenever cartItems change
  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  // Function to handle placing the order
  const handlePlaceOrder = async () => {
    const orderItems = cartItems.map(item => ({
      menuId: item._id,
      quantity: item.quantity,
    }));
  
    try {
      console.log('Placing order with the following items:', orderItems);
  
      const response = await fetch(api.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(), // Get the auth header
        },
        body: JSON.stringify({ items: orderItems }),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to place order');
      }
  
      const data = await response.json();
      console.log('Order placed successfully:', data);
      
      // Redirect to order confirmation or success page
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
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
            <span className="text-2xl font-semibold">Total: </span>
            <span className="text-2xl font-bold text-amber-500">{totalPrice.toFixed(2)} ETB.</span>
          </div>

          {/* Payment Options */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Payment Button - Santim Pay */}
            <button className="btn bg-white w-full h-14 sm:w-[48%] mb-4 sm:mb-0 flex items-center justify-center gap-2 text-black">
              <img src={santimLogo} alt="Santim Pay" className="h-full" />
              Pay with Santim Pay
            </button>

            {/* Payment Button - Chapa */}
            <button
              onClick={handlePlaceOrder} // Handle order placement
              className="btn bg-[#0d1b35] w-full h-14 sm:w-[48%] mb-4 sm:mb-0 flex items-center justify-center gap-2 py-0.5 text-white"
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