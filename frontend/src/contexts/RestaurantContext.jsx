import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api.js'; 

// Define the context
const RestaurantContext = createContext();

// Define the RestaurantProvider component
export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the restaurant info when the component mounts
    const fetchRestaurantInfo = async () => {
      try {
        const response = await axios.get(api.getAllRestaurantInfo);
        setRestaurant(response.data);
        console.log('Fetched restaurant data:', response.data); // Log the fetched data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, []);

  return (
    <RestaurantContext.Provider value={{ restaurant, loading, error }}>
      {children}
    </RestaurantContext.Provider>
  );
};

// Custom hook to use the restaurant context
export const useRestaurant = () => useContext(RestaurantContext);