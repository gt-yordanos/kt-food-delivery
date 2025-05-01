// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import api from '../api';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isItemInCart = (itemId) => {
    return cart.some(item => item.id === itemId);
  };

  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const saveCartToBackend = async (cart) => {
    if (user && user.role === 'customer') {
      try {
        await axios.post(api.saveCart, { cart }, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } catch (error) {
        console.error('Failed to save cart to backend:', error);
      }
    }
  };

  const addItemToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);
      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
      }
      saveCartToLocalStorage(updatedCart);
      saveCartToBackend(updatedCart);
      return updatedCart;
    });
  };

  const removeItemFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      saveCartToLocalStorage(updatedCart);
      saveCartToBackend(updatedCart);
      return updatedCart;
    });
  };

  const updateItemQuantity = (itemId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const itemIndex = updatedCart.findIndex((item) => item.id === itemId);
      if (itemIndex > -1) {
        updatedCart[itemIndex].quantity = quantity;
      }
      saveCartToLocalStorage(updatedCart);
      saveCartToBackend(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCartToLocalStorage([]);
    saveCartToBackend([]);
  };

  useEffect(() => {
    const fetchCartFromBackend = async () => {
      if (user && user.role === 'customer') {
        try {
          const response = await axios.get(api.getCart, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setCart(response.data.cart);
          saveCartToLocalStorage(response.data.cart);
        } catch (error) {
          console.error('Failed to fetch cart from backend:', error);
        }
      }
    };

    fetchCartFromBackend();
  }, [user]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItemToCart, 
      removeItemFromCart, 
      updateItemQuantity, 
      clearCart, 
      getItemCount,
      isItemInCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};