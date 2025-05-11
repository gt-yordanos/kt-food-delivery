import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth(); // Assuming your AuthContext provides a loading state
  const [customerData, setCustomerData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    password: '',
  });
  const [dataLoading, setDataLoading] = useState(false); // Loading state for fetching data
  const [saving, setSaving] = useState(false);  // Loading state for saving data

  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth loading is complete
    if (authLoading) return;

    // If no user or not a customer after auth is loaded, redirect to login
    if (!user || user.role !== 'customer') {
      navigate('/login');
      return;
    }

    // If we have a user and they're a customer, fetch their data
    if (user.id) {
      setDataLoading(true);
      axios
        .get(api.getCustomerInfo.replace('{customerId}', user.id), {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setCustomerData(response.data.customer);
          setFormData({
            ...response.data.customer,
            password: '', // Reset password field
          });
          setDataLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error);
          setDataLoading(false);
          toast.error("Error fetching customer data");
        });
    }
  }, [user, navigate, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); // Start saving
    try {
      await axios.put(
        api.updateCustomer.replace('{customerId}', user.id),
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error('Error updating customer data:', error);
      toast.error("Error updating customer data");
    } finally {
      setSaving(false); // Stop saving (even if there's an error)
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("You have logged out successfully!");
  };

  // Show loading spinner while auth is being checked or data is loading
  if (authLoading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-12">
      <div className="max-w-lg mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-amber-500 text-center">Profile Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={!editMode}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="middleName" className="block">Middle Name</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={!editMode}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={!editMode}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={!editMode}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              disabled={!editMode}
              required
            />
          </div>

          {editMode && (
            <div className="mb-4">
              <button type="submit" className="btn btn-primary">
                {saving ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="btn btn-secondary ml-2"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <div className="flex justify-between mt-4">
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-error"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;