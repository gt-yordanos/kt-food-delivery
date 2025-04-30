import { UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../api';

const ProfileModal = () => {
  const { user, logout } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (isCustomer && user?.id) {
        setLoading(true);
        try {
          const headers = getAuthHeader();
          const response = await axios.get(
            api.getCustomerInfo.replace('{customerId}', user.id), 
            { headers }
          );
          setCustomerData(response.data);
        } catch (error) {
          console.error('Failed to fetch customer data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [isCustomer, user?.id]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Get first letter of first name or fallback to icon
  const getAvatarContent = () => {
    if (isCustomer && customerData?.customer?.firstName) {
      return customerData.customer.firstName.charAt(0).toUpperCase();
    }
    return <UserRound className="w-6 h-6" />;
  };

  // Get welcome name or fallback to 'Customer'
  const getWelcomeName = () => {
    if (isCustomer && customerData?.customer?.firstName) {
      return customerData.customer.firstName;
    }
    return 'Customer';
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar bg-amber-500 hover:bg-amber-600 text-black">
        {getAvatarContent()}
      </div>
      <ul tabIndex={0} className="mt-6 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-300 rounded-box w-52">
        {isCustomer ? (
          <>
            <li className="menu-title">
              <span>Welcome, {getWelcomeName()}</span>
            </li>
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
            <li>
              <Link to="/profile/settings">Settings</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProfileModal;