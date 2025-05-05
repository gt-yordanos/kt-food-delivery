import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ loginApi, redirectLink }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const { loading, login, user } = useAuth(); // Make sure user is from context
  const navigate = useNavigate();
  const location = useLocation();

  // Check user role and navigate accordingly
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'restaurantOwner':
          navigate('/owner/dashboard');
          break;
        case 'deliveryPerson':
          navigate('/delivery-person');
          break;
        case 'customer':
          navigate('/');
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      setLoginLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        loginApi,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.token) {
        login(response.data.token);
        toast.success('Login successful!');
        navigate(redirectLink);
      } else {
        throw new Error('Invalid credentials or server error');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again');
      toast.error(err.response?.data?.message || 'Something went wrong, please try again');
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-[100vh] flex items-center justify-center">
      <div className="card bg-base-200 border-gray-600 border-1 sm:w-[80%] w-[90%]">
        <div className="card-body">
          <h2 className="font-bold text-center text-2xl mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <div className="relative">
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <div className="relative">
                <input
                  type="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {error && <p className="text-error text-sm">{error}</p>}

            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={loginLoading}>
                {loginLoading ? <span className="loading loading-spinner loading-md"></span> : 'Login'}
              </button>
            </div>
          </form>

          {/* Conditionally show Sign Up link if current path is /login */}
          {location.pathname === '/login' && (
            <p className="mt-4 text-center text-sm">
              New here?{' '}
              <Link to="/signup" className="text-primary underline hover:text-secondary">
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;