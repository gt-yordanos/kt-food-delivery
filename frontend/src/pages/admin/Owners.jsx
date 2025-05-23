import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaKey, FaUserAlt, FaPhone, FaEnvelope, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentOwner, setCurrentOwner] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
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
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    const password = currentOwner.password;
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
  }, [currentOwner.password, touched.password]);

  const fetchOwners = async () => {
    setLoadingTable(true);
    try {
      const response = await axios.get(api.getAllRestaurantOwners, getAuthHeader());
      setOwners(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching data', error);
      setOwners([]);
    } finally {
      setLoadingTable(false);
    }
  };

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

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    try {
      const response = await axios.get(`${api.searchRestaurantOwner}?query=${query}`, getAuthHeader());
      setOwners(response.data);
    } catch (error) {
      console.error('Error searching data', error);
      setOwners([]);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let error = '';
    switch (name) {
      case 'firstName':
        error = validateName(currentOwner.firstName, 'First name');
        break;
      case 'middleName':
        error = validateName(currentOwner.middleName, 'Middle name');
        break;
      case 'lastName':
        error = validateName(currentOwner.lastName, 'Last name');
        break;
      case 'email':
        error = validateEmail(currentOwner.email);
        break;
      case 'phoneNumber':
        error = validatePhone(currentOwner.phoneNumber);
        break;
      case 'password':
        error = validatePassword(currentOwner.password);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentOwner({ ...currentOwner, [name]: value });
    
    // Validate in real-time if the field has been touched
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
    const newErrors = {
      firstName: validateName(currentOwner.firstName, 'First name'),
      middleName: validateName(currentOwner.middleName, 'Middle name'),
      lastName: validateName(currentOwner.lastName, 'Last name'),
      email: validateEmail(currentOwner.email),
      phoneNumber: validatePhone(currentOwner.phoneNumber),
    };

    if (modalType === 'add' || modalType === 'reset') {
      newErrors.password = validatePassword(currentOwner.password);
    }

    setErrors(newErrors);
    // Mark all fields as touched when submitting
    setTouched({
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: modalType === 'add' || modalType === 'reset',
    });

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleAddOrEdit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let response;
      if (modalType === 'edit') {
        const { password, ...dataToUpdate } = currentOwner;
        response = await axios.put(
          api.updateRestaurantOwner.replace('{ownerId}', currentOwner._id),
          dataToUpdate,
          getAuthHeader()
        );
        toast.success('Updated successfully!');
      } else if (modalType === 'reset') {
        response = await axios.put(
          api.updateRestaurantOwner.replace('{ownerId}', currentOwner._id),
          { password: currentOwner.password },
          getAuthHeader()
        );
        toast.success('Password reset successfully!');
      } else {
        response = await axios.post(api.addRestaurantOwner, currentOwner, getAuthHeader());
        toast.success('Added successfully!');
      }

      fetchOwners();
      closeModal();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error saving data!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await axios.delete(api.deleteRestaurantOwner.replace('{ownerId}', id), getAuthHeader());
      toast.success('Deleted successfully!');
      fetchOwners();
    } catch (error) {
      toast.error('Error deleting data!');
    } finally {
      setDeleteLoading(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentOwner({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    });
    setErrors({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    });
    setTouched({
      firstName: false,
      middleName: false,
      lastName: false,
      email: false,
      phoneNumber: false,
      password: false,
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
      <h1 className="text-2xl font-bold mb-4">Restaurant Owners</h1>
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
          setCurrentOwner({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
          });
        }}
        className="btn btn-primary mb-4"
      >
        <FaPlus /> Add Restaurant Owner
      </button>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingTable ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <span className="loading loading-spinner loading-xl"></span>
                </td>
              </tr>
            ) : (
              owners.map(owner => (
                <tr key={owner._id}>
                  <td>{owner.firstName} {owner.middleName} {owner.lastName}</td>
                  <td>{owner.email}</td>
                  <td>{owner.phoneNumber}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentOwner(owner);
                        setModalType('edit');
                        setShowModal(true);
                      }}
                      className="btn btn-warning"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(owner._id)}
                      className="btn btn-error"
                    >
                      {deleteLoading === owner._id ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentOwner({ _id: owner._id, password: '' });
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
              {modalType === 'edit' ? 'Edit' : modalType === 'reset' ? 'Reset Password' : 'Add'} Restaurant Owner
            </h2>
            {modalType !== 'reset' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">First Name</span></label>
                  <div className="relative">
                    <input
                      name="firstName"
                      value={currentOwner.firstName}
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
                      value={currentOwner.middleName}
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
                      value={currentOwner.lastName}
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
                      value={currentOwner.email}
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
                      value={currentOwner.phoneNumber}
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
              </div>
            )}
            {(modalType === 'add' || modalType === 'reset') && (
              <div className="mt-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Password</span></label>
                  <div className="relative">
                    <input
                      name="password"
                      value={currentOwner.password}
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

export default Owners;