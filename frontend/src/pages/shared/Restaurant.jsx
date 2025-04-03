import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaEdit, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Restaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState({});

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(api.getRestaurant, getAuthHeader());
      setRestaurant(response.data);
      setEditedRestaurant(response.data); // Set editable data
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant details');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(api.updateRestaurant, editedRestaurant, getAuthHeader());
      toast.success(response.data.message || 'Restaurant updated successfully');
      setRestaurant(editedRestaurant);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error(error?.response?.data?.message || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditedRestaurant({ ...editedRestaurant, [e.target.name]: e.target.value });
  };

  if (!restaurant) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Restaurant Details</h1>
      
      <div className="mb-4">
        <label className="font-semibold">Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedRestaurant.name}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        ) : (
          <p>{restaurant.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="font-semibold">About:</label>
        {isEditing ? (
          <textarea
            name="about"
            value={editedRestaurant.about}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        ) : (
          <p>{restaurant.about}</p>
        )}
      </div>

      <div className="mb-4 flex items-center">
        <FaMapMarkerAlt className="mr-2" />
        <label className="font-semibold">Address:</label>
        {isEditing ? (
          <input
            type="text"
            name="address"
            value={editedRestaurant.address}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        ) : (
          <p>{restaurant.address}</p>
        )}
      </div>

      <div className="mb-4 flex items-center">
        <FaPhoneAlt className="mr-2" />
        <label className="font-semibold">Phone:</label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={editedRestaurant.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        ) : (
          <p>{restaurant.phone}</p>
        )}
      </div>

      <div className="mb-4 flex items-center">
        <FaEnvelope className="mr-2" />
        <label className="font-semibold">Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={editedRestaurant.email}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        ) : (
          <p>{restaurant.email}</p>
        )}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold flex items-center">
          <FaClock className="mr-2" /> Opening Hours:
        </h2>
        {Object.entries(restaurant?.openingHours || {}).map(([day, hours]) => (
          <p key={day}><strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {hours || 'N/A'}</p>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Social Links:</h2>
        {Object.entries(restaurant?.socialLinks || {}).map(([platform, link]) => (
          <p key={platform}><strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong> {link || 'N/A'}</p>
        ))}
      </div>

      <div className="mt-4">
        {isEditing ? (
          <button onClick={handleSaveClick} className="btn btn-success">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : <><FaSave /> Save</>}
          </button>
        ) : (
          <button onClick={handleEditClick} className="btn btn-warning">
            <FaEdit /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Restaurant;