import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaKey, FaUserAlt, FaPhone, FaEnvelope, FaHome, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });
  const [touched, setTouched] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    password: false,
    phoneNumber: false,
    address: false,
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const password = currentCustomer.password || '';
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });

    if (touched.password) {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(password)
      }));
    }
  }, [currentCustomer.password, touched.password]);

  const fetchCustomers = async () => {
    setFetching(true);
    try {
      const response = await axios.get(api.getAllCustomers, getAuthHeader());
      setCustomers(Array.isArray(response.data.customers) ? response.data.customers : []);
    } catch (error) {
      console.error('Error fetching data', error);
      setCustomers([]);
    } finally {
      setFetching(false);
    }
  };

  const validateName = (name, fieldName) => {
    if (!name || !name.trim()) return `${fieldName} is required`;
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

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    try {
      const response = await axios.get(`${api.searchCustomerByName}?name=${query}`, getAuthHeader());
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error searching data', error);
      setCustomers([]);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let error = '';
    switch (name) {
      case 'firstName':
        error = validateName(currentCustomer.firstName || '', 'First name');
        break;
      case 'middleName':
        error = validateName(currentCustomer.middleName || '', 'Middle name');
        break;
      case 'lastName':
        error = validateName(currentCustomer.lastName || '', 'Last name');
        break;
      case 'email':
        error = validateEmail(currentCustomer.email || '');
        break;
      case 'phoneNumber':
        error = validatePhone(currentCustomer.phoneNumber || '');
        break;
      case 'address':
        error = validateAddress(currentCustomer.address || '');
        break;
      case 'password':
        error = validatePassword(currentCustomer.password || '');
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
    
    if (touched[name]) {
      let error = '';
      switch (name) {
        case 'firstName':
          error = validateName(value, 'First name');
          break;
        case 'middleName':
          error = validateName(value, 'Middle name');
          break;
        case 'lastName':
          error = validateName(value, 'Last name');
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'phoneNumber':
          error = validatePhone(value);
          break;
        case 'address':
          error = validateAddress(value);
          break;
        case 'password':
          error = validatePassword(value);
          break;
        default:
          break;
      }
      
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate name fields if not in reset mode
    if (modalType !== 'reset') {
      newErrors.firstName = validateName(currentCustomer.firstName || '', 'First name');
      newErrors.middleName = validateName(currentCustomer.middleName || '', 'Middle name');
      newErrors.lastName = validateName(currentCustomer.lastName || '', 'Last name');
      newErrors.email = validateEmail(currentCustomer.email || '');
      newErrors.phoneNumber = validatePhone(currentCustomer.phoneNumber || '');
      newErrors.address = validateAddress(currentCustomer.address || '');
    }

    // Always validate password in add or reset mode
    if (modalType === 'add' || modalType === 'reset') {
      newErrors.password = validatePassword(currentCustomer.password || '');
    }

    setErrors(newErrors);
    
    // Only mark fields as touched that we're actually validating
    setTouched({
      firstName: modalType !== 'reset',
      middleName: modalType !== 'reset',
      lastName: modalType !== 'reset',
      email: modalType !== 'reset',
      password: modalType === 'add' || modalType === 'reset',
      phoneNumber: modalType !== 'reset',
      address: modalType !== 'reset',
    });

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleAddOrEdit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (modalType === 'edit') {
        const { password, ...dataToUpdate } = currentCustomer;
        await axios.put(
          api.updateCustomer.replace('{customerId}', currentCustomer._id),
          dataToUpdate,
          getAuthHeader()
        );
        toast.success('Updated successfully!');
      } else if (modalType === 'reset') {
        await axios.put(
          api.updateCustomer.replace('{customerId}', currentCustomer._id),
          { password: currentCustomer.password },
          getAuthHeader()
        );        
        toast.success('Password reset successfully!');
      } else {
        await axios.post(api.create, currentCustomer, getAuthHeader());
        toast.success('Customer added successfully!');
      }

      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error('Error during API request:', error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'Error saving data!'}`);
      } else {
        toast.error('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await axios.delete(api.deleteCustomer.replace('{customerId}', id), getAuthHeader());
      toast.success('Deleted successfully!');
      fetchCustomers();
    } catch (error) {
      toast.error('Error deleting data!');
    } finally {
      setDeleteLoading(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCustomer({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
    });
    setErrors({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
    });
    setTouched({
      firstName: false,
      middleName: false,
      lastName: false,
      email: false,
      password: false,
      phoneNumber: false,
      address: false,
    });
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
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearch}
        className="input input-bordered w-full mb-4"
      />
      <button
        onClick={() => {
          setShowModal(true);
          setModalType('add');
          setCurrentCustomer({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            address: '',
          });
        }}
        className="btn btn-primary mb-4"
      >
        <FaPlus /> Add Customer
      </button>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    {customer.firstName} {customer.middleName} {customer.lastName}
                  </td>
                  <td>{customer.phoneNumber}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentCustomer({ ...customer });
                        setModalType('edit');
                        setShowModal(true);
                      }}
                      className="btn btn-warning"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="btn btn-error"
                    >
                      {deleteLoading === customer._id ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentCustomer({ ...customer, password: '' });
                        setModalType('reset');
                        setShowModal(true);
                      }}
                      className="btn btn-info"
                    >
                      <FaKey />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h2 className="text-lg font-bold mb-4">
              {modalType === 'edit'
                ? 'Edit'
                : modalType === 'reset'
                ? 'Reset Password'
                : 'Add'}{' '}
              Customer
            </h2>
            {modalType !== 'reset' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">First Name</span></label>
                  <div className="relative">
                    <input
                      name="firstName"
                      value={currentCustomer.firstName || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full pl-10 ${errors.firstName && touched.firstName ? 'input-error' : ''}`}
                      placeholder="First Name"
                    />
                    <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.firstName && touched.firstName && <span className="text-error text-xs mt-1">{errors.firstName}</span>}
                </div>

                {/* Middle Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Middle Name</span></label>
                  <div className="relative">
                    <input
                      name="middleName"
                      value={currentCustomer.middleName || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full ${errors.middleName && touched.middleName ? 'input-error' : ''}`}
                      placeholder="Middle Name"
                    />
                  </div>
                  {errors.middleName && touched.middleName && <span className="text-error text-xs mt-1">{errors.middleName}</span>}
                </div>

                {/* Last Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Last Name</span></label>
                  <div className="relative">
                    <input
                      name="lastName"
                      value={currentCustomer.lastName || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full ${errors.lastName && touched.lastName ? 'input-error' : ''}`}
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && touched.lastName && <span className="text-error text-xs mt-1">{errors.lastName}</span>}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Email</span></label>
                  <div className="relative">
                    <input
                      name="email"
                      value={currentCustomer.email || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="email"
                      className={`input input-bordered w-full pl-10 ${errors.email && touched.email ? 'input-error' : ''}`}
                      placeholder="Email"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.email && touched.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
                </div>

                {/* Phone Number */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Phone Number</span></label>
                  <div className="relative">
                    <input
                      name="phoneNumber"
                      value={currentCustomer.phoneNumber || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full pl-10 ${errors.phoneNumber && touched.phoneNumber ? 'input-error' : ''}`}
                      placeholder="09XXXXXXXX or +2519XXXXXX"
                    />
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.phoneNumber && touched.phoneNumber && <span className="text-error text-xs mt-1">{errors.phoneNumber}</span>}
                </div>

                {/* Address */}
                <div className="form-control col-span-2">
                  <label className="label"><span className="label-text">Address</span></label>
                  <div className="relative">
                    <input
                      name="address"
                      value={currentCustomer.address || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full pl-10 ${errors.address && touched.address ? 'input-error' : ''}`}
                      placeholder="Address"
                    />
                    <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.address && touched.address && <span className="text-error text-xs mt-1">{errors.address}</span>}
                  <span className="text-xs text-gray-500 mt-1">Address must be at least 6 characters long</span>
                </div>
              </div>
            )}
            {(modalType === 'add' || modalType === 'reset') && (
              <div className="mt-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Password</span></label>
                  <div className="relative">
                    <input
                      name="password"
                      value={currentCustomer.password || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="password"
                      className={`input input-bordered w-full pl-10 ${errors.password && touched.password ? 'input-error' : ''}`}
                      placeholder="Password"
                    />
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.password && touched.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
                  {renderPasswordCriteria()}
                </div>
              </div>
            )}
            <div className="modal-action">
              <button onClick={handleAddOrEdit} className="btn btn-success">
                {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
              </button>
              <button onClick={closeModal} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;