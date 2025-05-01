import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; // Import the useAuth hook

// Import logos from the assets folder
import santimLogo from '../../assets/santimPay.jpg';
import chapaLogo from '../../assets/chapa.jpg';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Get user from AuthContext
  const { items } = location.state || {};
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
            <button className="btn bg-[#0d1b35] w-full h-14 sm:w-[48%] mb-4 sm:mb-0 flex items-center justify-center gap-2 py-0.5 text-white">
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