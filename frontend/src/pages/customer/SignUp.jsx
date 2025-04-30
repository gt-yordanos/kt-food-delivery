import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserAlt, FaLock, FaPhone, FaEnvelope, FaHome } from 'react-icons/fa';
import axios from 'axios';
import api from '../../api';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const response = await axios.post(api.create, submitData, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Sign up successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto min-h-[100vh] flex items-center justify-center pt-24 pb-8">
      <div className="card bg-base-200 border-gray-600 border-1 sm:w-[80%] w-[90%]">
        <div className="card-body">
          <h2 className="font-bold text-center text-2xl mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* First Name */}
            <div className="form-control">
              <label className="label"><span className="label-text">First Name</span></label>
              <div className="relative">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="First Name"
                  required
                />
                <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Middle Name */}
            <div className="form-control">
              <label className="label"><span className="label-text">Middle Name</span></label>
              <input
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full"
                placeholder="Middle Name"
              />
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label className="label"><span className="label-text">Last Name</span></label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full"
                placeholder="Last Name"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label"><span className="label-text">Phone Number</span></label>
              <div className="relative">
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Phone Number"
                  required
                />
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <div className="relative">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="Email"
                  required
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="Password"
                  required
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm Password</span></label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="Confirm Password"
                  required
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label"><span className="label-text">Address</span></label>
              <div className="relative">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Address"
                  required
                />
                <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-md"></span> : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Optional Login link */}
          {location.pathname === '/signup' && (
            <p className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary underline hover:text-secondary">
                Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;