// src/context/CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addItemToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeItemFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateItemQuantity = (itemId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const itemIndex = updatedCart.findIndex((item) => item.id === itemId);
      if (itemIndex > -1) {
        updatedCart[itemIndex].quantity = quantity;
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};