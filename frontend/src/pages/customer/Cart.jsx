import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeItemFromCart, updateItemQuantity, clearCart } = useCart();

  const handleQuantityChange = (itemId, e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center text-lg text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-base-200 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                  <div>
                    <p className="font-medium text-lg">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-amber-500 font-bold">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e)}
                    className="input input-bordered w-16 text-center"
                  />
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">Total: ${getTotalPrice()}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearCart}
                className="btn btn-warning mr-4"
              >
                Clear Cart
              </button>
              <Link to="/checkout">
                <button className="btn btn-primary">Proceed to Checkout</button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;