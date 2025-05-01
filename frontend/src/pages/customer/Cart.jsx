import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, loading, cartCount, clearCart } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalPrice(total);
    };

    calculateTotal();
  }, [cart]);

  const handleClearCart = () => {
    // Ask for confirmation before clearing the cart
    const confirmClear = window.confirm("Are you sure you want to clear your cart?");
    if (confirmClear) {
      clearCart();
      toast.success("Your cart has been cleared!");
    }
  };

  return (
    <div className="px-4 sm:px-[5%] lg:px-[15%] py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Cart</h2>
      
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div className="flex w-52 flex-col gap-4" key={index}>
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {cart.length === 0 ? (
            <p className="text-center text-xl text-gray-600">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 mb-4 bg-base-300 shadow-lg rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <span className="text-xl text-amber-500 font-bold">{item.price} ETB.</span>
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
            ))
          )}
          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <span className="text-2xl font-semibold">Total: </span>
            <span className="text-2xl font-bold text-amber-500">{totalPrice.toFixed(2)} ETB.</span>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handleClearCart}
              className="btn btn-danger w-full lg:w-48"
            >
              Clear Cart
            </button>
            <button
              className="btn btn-primary w-full lg:w-48"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;