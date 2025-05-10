import React, { useState, useEffect } from 'react';
import { UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../shared/ThemeToggle';
import ktLogo from '../../assets/ktLogo.png';
import axios from 'axios';
import api from '../../api';

const Navbar = ({ filters, setFilters }) => {
  const { user, logout } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [campusName, setCampusName] = useState('');

  const isDeliveryPerson = user?.role === 'deliveryPerson';

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (isDeliveryPerson && user?.id) {
        console.log('User ID:', user.id);
        setLoading(true);
        try {
          const headers = getAuthHeader();
          const response = await axios.get(
            api.getDeliveryPersonById.replace('{deliveryPersonId}', user.id),
            { headers }
          );
          setCustomerData(response.data);

          if (response.data?.campus) {
            setCampusName(response.data.campus);
          }
        } catch (error) {
          console.error('Failed to fetch delivery person data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [isDeliveryPerson, user?.id]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getAvatarContent = () => {
    if (isDeliveryPerson && customerData?.firstName) {
      return customerData.firstName.charAt(0).toUpperCase();
    }
    return <UserRound className="w-6 h-6" />;
  };

  const getWelcomeName = () => {
    if (isDeliveryPerson && customerData?.firstName) {
      return customerData.firstName;
    }
    return 'KT Delivery Person';
  };

  useEffect(() => {
    // Whenever filters change, automatically apply them
    setFilters(filters);
  }, [filters, setFilters]);

  return (
    <div className="py-2 px-4 sm:px-[5%] lg:px-[15%] bg-base-300 shadow-md fixed top-0 left-0 w-full z-50 relative h-[72px] flex items-center">
      {/* Left Section: Logo */}
      <div className="absolute left-4 sm:left-[5%] lg:left-[15%] flex items-center gap-2">
        <img src={ktLogo} alt="KT Logo" className="h-10 w-10" />
      </div>

      {/* Center Section: Filter Inputs for Delivery Status and Customer Verification */}
      <div className="mx-auto flex items-center gap-2 sm:gap-4 md:gap-6">
        <select
          value={filters.deliveryStatus}
          onChange={(e) => setFilters({ ...filters, deliveryStatus: e.target.value })}
          className="select select-bordered px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-[120px] sm:w-[150px]"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="inProgress">In Progress</option>
          <option value="delivered">Delivered</option>
        </select>

        <select
          value={filters.customerVerified}
          onChange={(e) => setFilters({ ...filters, customerVerified: e.target.value })}
          className="select select-bordered px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm w-[145px] sm:w-[200px]"
        >
          <option value="">Select Verification</option>
          <option value="true">Verified</option>
          <option value="false">Not Verified</option>
        </select>
      </div>

      {/* Right Section: Profile Dropdown */}
      <div className="absolute right-4 sm:right-[5%] lg:right-[15%] flex items-center gap-4">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar bg-amber-500 hover:bg-amber-600 text-black"
          >
            {getAvatarContent()}
          </div>
          <ul
            tabIndex={0}
            className="mt-6 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-300 rounded-box w-52"
          >
            <li className="menu-title">
              <span>Welcome, {getWelcomeName()}</span>
            </li>
            <li>
              <span>KT Delivery Person</span>
            </li>
            <li>
              <span>Campus: {campusName || 'Not Available'}</span>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
            <li>
              <div className="flex items-center">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;