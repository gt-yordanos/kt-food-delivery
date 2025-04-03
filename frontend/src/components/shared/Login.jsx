import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

const Login = ({ loginApi, redirectLink }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields'); // Show error toast
      return;
    }

    try {
      const response = await loginApi(email, password);
      const { token } = response.data;
      login(token);
      navigate(redirectLink);
      toast.success('Login successful!'); // Show success toast
    } catch (err) {
      setError('Invalid credentials or server error');
      toast.error('Invalid credentials or server error'); // Show error toast
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="card shadow-lg bg-base-200">
        <div className="card-body">
          <h2 className="font-bold text-center text-2xl">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
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

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
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

            {/* Error message */}
            {error && <p className="text-error text-sm">{error}</p>}

            {/* Submit Button with loading spinner */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="loading loading-spinner loading-lg"></span>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;