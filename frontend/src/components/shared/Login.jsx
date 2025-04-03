import React, { useState } from 'react';
import { useAuth } from '.../contexts/AuthContext';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = ({ loginApi, redirectLink }) => {
  const { login } = useAuth();
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
      return;
    }

    try {
      const response = await loginApi(email, password);
      const { token } = response.data;
      login(token);
      navigate(redirectLink);
    } catch (err) {
      setError('Invalid credentials or server error');
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="input-group">
                <span className="input-group-addon">
                  <FaUserAlt />
                </span>
                <input
                  type="email"
                  className="input input-bordered"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="input-group">
                <span className="input-group-addon">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="input input-bordered"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;