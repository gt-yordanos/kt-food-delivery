import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage or API
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (user?.role === 'customer') {
        // Fetch cart from backend if user is a customer
        try {
          setLoading(true);
          const response = await axios.get(`/api/cart/${user.id}`);
          setCart(response.data.cart || storedCart);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCart(storedCart);
        } finally {
          setLoading(false);
        }
      } else {
        setCart(storedCart);
      }
    };

    loadCart();
  }, [user]);

  // Update cart in localStorage and backend (if customer)
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    if (user?.role === 'customer') {
      // Update backend cart
      axios.post(`/api/cart/${user.id}`, { cart: updatedCart });
    }
    updateCartCount(updatedCart);
  };

  // Update cart count
  const updateCartCount = (updatedCart) => {
    const totalCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  };

  // Clear all items from cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    if (user?.role === 'customer') {
      axios.post(`/api/cart/${user.id}`, { cart: [] }); // Clear cart on the server
    }
    updateCartCount([]);
  };

  // Add item to cart
  const addToCart = (item) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex((cartItem) => cartItem._id === item._id);

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }

    updateCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    updateCart(updatedCart);
  };

  // Increase item quantity
  const increaseQuantity = (itemId) => {
    const updatedCart = [...cart];
    const item = updatedCart.find((item) => item._id === itemId);
    if (item) {
      item.quantity += 1;
      updateCart(updatedCart);
    }
  };

  // Decrease item quantity
  const decreaseQuantity = (itemId) => {
    const updatedCart = [...cart];
    const item = updatedCart.find((item) => item._id === itemId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // If quantity is 1, remove the item from the cart
        updatedCart.splice(updatedCart.indexOf(item), 1);
      }
      updateCart(updatedCart);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);