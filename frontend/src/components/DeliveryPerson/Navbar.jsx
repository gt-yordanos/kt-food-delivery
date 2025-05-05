import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import api from '../../api';
import ThemeToggle from '../shared/ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [campusName, setCampusName] = useState('');

  const isDeliveryPerson = user?.role === 'deliveryPerson';

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (isDeliveryPerson && user?.id) {
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

  return (
    <div className="py-2 px-4 sm:px-[5%] lg:px-[15%] bg-base-300 shadow-md fixed top-0 left-0 w-full z-50 relative h-[72px] flex items-center">
      
      {/* Left Section */}
      <div className="absolute left-4 sm:left-[5%] lg:left-[15%]">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-xl font-extrabold shadow-lg">
          KT Delivery Person
        </div>
      </div>

      {/* Center Section */}
      <div className="mx-auto">
        <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 py-2 rounded-full text-lg font-semibold shadow-md">
          Campus: {campusName || 'Not Available'}
        </div>
      </div>

      {/* Right Section */}
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
            {isDeliveryPerson && (
              <>
                <li className="menu-title">
                  <span>Welcome, {getWelcomeName()}</span>
                </li>
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
                <li>
                  <ThemeToggle />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;