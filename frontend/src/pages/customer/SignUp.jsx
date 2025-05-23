import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserAlt, FaLock, FaPhone, FaEnvelope, FaHome, FaCheck, FaTimes } from 'react-icons/fa';
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

  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Update password criteria whenever password changes
    const password = form.password;
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [form.password]);

  const validateName = (name, fieldName) => {
    if (!name.trim()) return `${fieldName} is required`;
    if (/[0-9]/.test(name)) return 'Name cannot contain numbers';
    if (!/^[a-zA-Z]+$/.test(name)) return 'Name should only contain letters';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    const cleaned = phone.replace(/\D/g, '');
    
    if (!/^(09|2519)\d{8}$/.test(cleaned) && !/^\+2519\d{8}$/.test(phone)) {
      return 'Phone must start with 09, +2519 or 2519 and be 10 digits total';
    }
    
    if (cleaned.length !== 10 && !phone.startsWith('+2519')) {
      return 'Phone number must be 10 digits';
    }
    
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateAddress = (address) => {
    if (!address) return 'Address is required';
    if (address.length < 6) return 'Address must be at least 6 characters long';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return validateName(value, 'First name');
      case 'middleName':
        return validateName(value, 'Middle name');
      case 'lastName':
        return validateName(value, 'Last name');
      case 'phoneNumber':
        return validatePhone(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        return form.password !== value ? 'Passwords do not match' : '';
      case 'email':
        return validateEmail(value);
      case 'address':
        return validateAddress(value);
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate all fields before submission
    let formIsValid = true;
    const newErrors = {};
    
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      newErrors[key] = error;
      if (error) formIsValid = false;
    });
    
    setErrors(newErrors);
    
    if (!formIsValid) {
      setFormError('Please fix the errors in the form');
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
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordCriteria = () => {
    return (
      <div className="mt-2 space-y-1">
        <div className={`flex items-center text-xs ${passwordCriteria.length ? 'text-emerald-500' : 'text-error'}`}>
          {passwordCriteria.length ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
          At least 8 characters
        </div>
        <div className={`flex items-center text-xs ${passwordCriteria.uppercase ? 'text-emerald-500' : 'text-error'}`}>
          {passwordCriteria.uppercase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
          At least one uppercase letter
        </div>
        <div className={`flex items-center text-xs ${passwordCriteria.lowercase ? 'text-emerald-500' : 'text-error'}`}>
          {passwordCriteria.lowercase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
          At least one lowercase letter
        </div>
        <div className={`flex items-center text-xs ${passwordCriteria.number ? 'text-emerald-500' : 'text-error'}`}>
          {passwordCriteria.number ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
          At least one number
        </div>
        <div className={`flex items-center text-xs ${passwordCriteria.specialChar ? 'text-emerald-500' : 'text-error'}`}>
          {passwordCriteria.specialChar ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
          At least one special character
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-sm mx-auto min-h-[100vh] flex items-center justify-center pt-24 pb-8">
      <div className="card bg-base-200 border-gray-600 border-1 sm:w-[80%] w-[90%]">
        <div className="card-body">
          <h2 className="font-bold text-center text-2xl mb-6">Sign Up</h2>
          {formError && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* First Name */}
            <div className="form-control">
              <label className="label"><span className="label-text">First Name</span></label>
              <div className="relative">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  className={`input input-bordered w-full pl-10 ${errors.firstName ? 'input-error' : ''}`}
                  placeholder="First Name"
                  required
                />
                <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.firstName && <span className="text-error text-xs mt-1">{errors.firstName}</span>}
            </div>

            {/* Middle Name */}
            <div className="form-control">
              <label className="label"><span className="label-text">Middle Name</span></label>
              <div className="relative">
                <input
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  className={`input input-bordered w-full ${errors.middleName ? 'input-error' : ''}`}
                  placeholder="Middle Name"
                  required
                />
              </div>
              {errors.middleName && <span className="text-error text-xs mt-1">{errors.middleName}</span>}
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label className="label"><span className="label-text">Last Name</span></label>
              <div className="relative">
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Last Name"
                  required
                />
              </div>
              {errors.lastName && <span className="text-error text-xs mt-1">{errors.lastName}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label"><span className="label-text">Phone Number</span></label>
              <div className="relative">
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  className={`input input-bordered w-full pl-10 ${errors.phoneNumber ? 'input-error' : ''}`}
                  placeholder="09XXXXXXXX or +2519XXXXXX"
                  required
                />
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.phoneNumber && <span className="text-error text-xs mt-1">{errors.phoneNumber}</span>}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <div className="relative">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="email"
                  className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="Email"
                  required
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="password"
                  className={`input input-bordered w-full pl-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Password"
                  required
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
              {renderPasswordCriteria()}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm Password</span></label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="password"
                  className={`input input-bordered w-full pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm Password"
                  required
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.confirmPassword && <span className="text-error text-xs mt-1">{errors.confirmPassword}</span>}
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label"><span className="label-text">Address</span></label>
              <div className="relative">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  className={`input input-bordered w-full pl-10 ${errors.address ? 'input-error' : ''}`}
                  placeholder="Address"
                  required
                />
                <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.address && <span className="text-error text-xs mt-1">{errors.address}</span>}
              <span className="text-xs text-gray-500 mt-1">Address must be at least 6 characters long</span>
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