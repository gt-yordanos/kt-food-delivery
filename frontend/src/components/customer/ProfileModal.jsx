import { UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfileModal = () => {
  const { user, logout } = useAuth();
  
  // Only consider users with role 'customer' as valid logged-in users
  const isCustomer = user?.role === 'customer';
  
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar bg-amber-500 hover:bg-amber-600 text-black">
        <UserRound className="w-6 h-6" />
      </div>
      <ul tabIndex={0} className="mt-6 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-300 rounded-box w-52">
        {isCustomer ? (
          <>
            <li className="menu-title">
              <span>Welcome, Customer</span>
            </li>
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
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