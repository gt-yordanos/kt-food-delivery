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

const DeliveryPerson = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentPerson, setCurrentPerson] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    campus: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    campus: '',
  });
  const [touched, setTouched] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    password: false,
    phoneNumber: false,
    campus: false,
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
    fetchDeliveryPersons();
  }, []);

  useEffect(() => {
    const password = currentPerson.password;
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
  }, [currentPerson.password, touched.password]);

  const fetchDeliveryPersons = async () => {
    setFetching(true);
    try {
      const response = await axios.get(api.getAllDeliveryPersons, getAuthHeader());
      setDeliveryPersons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching data', error);
      toast.error('Failed to fetch delivery persons');
      setDeliveryPersons([]);
    } finally {
      setFetching(false);
    }
  };

  const searchDeliveryPersons = async () => {
    if (!searchQuery.trim()) {
      fetchDeliveryPersons();
      return;
    }

    setFetching(true);
    try {
      const response = await axios.get(
        `${api.searchDeliveryPerson}?query=${searchQuery}`,
        getAuthHeader()
      );
      setDeliveryPersons(response.data || []);
    } catch (error) {
      console.error('Error searching delivery persons', error);
      toast.error('Failed to search delivery persons');
      setDeliveryPersons([]);
    } finally {
      setFetching(false);
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

  const validateCampus = (campus) => {
    if (!campus) return 'Campus is required';
    return '';
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchDeliveryPersons();
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let error = '';
    switch (name) {
      case 'firstName':
        error = validateName(currentPerson.firstName, 'First name');
        break;
      case 'middleName':
        error = validateName(currentPerson.middleName, 'Middle name');
        break;
      case 'lastName':
        error = validateName(currentPerson.lastName, 'Last name');
        break;
      case 'email':
        error = validateEmail(currentPerson.email);
        break;
      case 'phoneNumber':
        error = validatePhone(currentPerson.phoneNumber);
        break;
      case 'campus':
        error = validateCampus(currentPerson.campus);
        break;
      case 'password':
        error = validatePassword(currentPerson.password);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPerson(prev => ({
      ...prev,
      [name]: value
    }));
    
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
        case 'campus':
          error = validateCampus(value);
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
      firstName: validateName(currentPerson.firstName, 'First name'),
      middleName: validateName(currentPerson.middleName, 'Middle name'),
      lastName: validateName(currentPerson.lastName, 'Last name'),
      email: validateEmail(currentPerson.email),
      phoneNumber: validatePhone(currentPerson.phoneNumber),
      campus: validateCampus(currentPerson.campus),
    };

    if (modalType === 'add' || modalType === 'reset') {
      newErrors.password = validatePassword(currentPerson.password);
    }

    setErrors(newErrors);
    // Mark all fields as touched when submitting
    setTouched({
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      campus: true,
      password: modalType === 'add' || modalType === 'reset',
    });

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleAddOrEdit = async () => {
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (modalType === 'edit') {
        const { password, ...dataToUpdate } = currentPerson;
        response = await axios.put(
          api.updateDeliveryPerson.replace('{deliveryPersonId}', currentPerson._id),
          dataToUpdate,
          getAuthHeader()
        );
        toast.success('Delivery person updated successfully!');
      } else if (modalType === 'reset') {
        response = await axios.put(
          api.updateDeliveryPerson.replace('{deliveryPersonId}', currentPerson._id),
          { password: currentPerson.password },
          getAuthHeader()
        );
        toast.success('Password reset successfully!');
      } else {
        response = await axios.post(api.addDeliveryPerson, currentPerson, getAuthHeader());
        toast.success('Delivery person added successfully!');
      }

      fetchDeliveryPersons();
      closeModal();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error saving data!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery person?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await axios.delete(api.deleteDeliveryPerson.replace('{deliveryPersonId}', id), getAuthHeader());
      toast.success('Delivery person deleted successfully!');
      fetchDeliveryPersons();
    } catch (error) {
      toast.error('Error deleting delivery person!');
    } finally {
      setDeleteLoading(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPerson({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      campus: '',
    });
    setErrors({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      campus: '',
    });
    setTouched({
      firstName: false,
      middleName: false,
      lastName: false,
      email: false,
      password: false,
      phoneNumber: false,
      campus: false,
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
      <h1 className="text-2xl font-bold mb-4">Delivery Persons</h1>
      
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            name="searchQuery"
            placeholder="Search by name, email or phone"
            value={searchQuery}
            onChange={handleSearchChange}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button 
            type="button" 
            onClick={() => {
              setSearchQuery('');
              fetchDeliveryPersons();
            }} 
            className="btn btn-ghost"
          >
            Clear
          </button>
        </div>
      </form>

      <button
        onClick={() => {
          setShowModal(true);
          setModalType('add');
          setCurrentPerson({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            campus: '',
          });
        }}
        className="btn btn-primary mb-4"
      >
        <FaPlus /> Add Delivery Person
      </button>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Campus</th>
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
            ) : deliveryPersons.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  {searchQuery ? 'No matching delivery persons found' : 'No delivery persons available'}
                </td>
              </tr>
            ) : (
              deliveryPersons.map(person => (
                <tr key={person._id}>
                  <td>{person.firstName} {person.middleName} {person.lastName}</td>
                  <td>{person.phoneNumber}</td>
                  <td>{person.email}</td>
                  <td>{person.campus}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentPerson(person);
                        setModalType('edit');
                        setShowModal(true);
                      }}
                      className="btn btn-warning btn-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(person._id)}
                      className="btn btn-error btn-sm"
                    >
                      {deleteLoading === person._id ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPerson({ _id: person._id, password: '' });
                        setModalType('reset');
                        setShowModal(true);
                      }}
                      className="btn btn-info btn-sm"
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
              {modalType === 'edit' ? 'Edit' : modalType === 'reset' ? 'Reset Password' : 'Add'} Delivery Person
            </h2>
            {modalType !== 'reset' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">First Name</span></label>
                  <div className="relative">
                    <input
                      name="firstName"
                      value={currentPerson.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full pl-10 ${errors.firstName && touched.firstName ? 'input-error' : ''}`}
                      placeholder="First Name"
                    />
                    <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.firstName && touched.firstName && (
                    <span className="text-error text-xs mt-1">{errors.firstName}</span>
                  )}
                </div>

                {/* Middle Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Middle Name</span></label>
                  <div className="relative">
                    <input
                      name="middleName"
                      value={currentPerson.middleName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full ${errors.middleName && touched.middleName ? 'input-error' : ''}`}
                      placeholder="Middle Name"
                    />
                  </div>
                  {errors.middleName && touched.middleName && (
                    <span className="text-error text-xs mt-1">{errors.middleName}</span>
                  )}
                </div>

                {/* Last Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Last Name</span></label>
                  <div className="relative">
                    <input
                      name="lastName"
                      value={currentPerson.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full ${errors.lastName && touched.lastName ? 'input-error' : ''}`}
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && touched.lastName && (
                    <span className="text-error text-xs mt-1">{errors.lastName}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Email</span></label>
                  <div className="relative">
                    <input
                      name="email"
                      value={currentPerson.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="email"
                      className={`input input-bordered w-full pl-10 ${errors.email && touched.email ? 'input-error' : ''}`}
                      placeholder="Email"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.email && touched.email && (
                    <span className="text-error text-xs mt-1">{errors.email}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Phone Number</span></label>
                  <div className="relative">
                    <input
                      name="phoneNumber"
                      value={currentPerson.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      className={`input input-bordered w-full pl-10 ${errors.phoneNumber && touched.phoneNumber ? 'input-error' : ''}`}
                      placeholder="09XXXXXXXX or +2519XXXXXX"
                    />
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.phoneNumber && touched.phoneNumber && (
                    <span className="text-error text-xs mt-1">{errors.phoneNumber}</span>
                  )}
                </div>

                {/* Campus */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Campus</span></label>
                  <select
                    name="campus"
                    value={currentPerson.campus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`select select-bordered w-full ${errors.campus && touched.campus ? 'select-error' : ''}`}
                  >
                    <option value="">Select Campus</option>
                    <option value="Main">Main</option>
                    <option value="HiT">HiT</option>
                    <option value="CVM">CVM</option>
                  </select>
                  {errors.campus && touched.campus && (
                    <span className="text-error text-xs mt-1">{errors.campus}</span>
                  )}
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
                      value={currentPerson.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="password"
                      className={`input input-bordered w-full pl-10 ${errors.password && touched.password ? 'input-error' : ''}`}
                      placeholder="Password"
                    />
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.password && touched.password && (
                    <span className="text-error text-xs mt-1">{errors.password}</span>
                  )}
                  {renderPasswordCriteria()}
                </div>
              </div>
            )}
            <div className="modal-action">
              <button 
                type="button"
                onClick={handleAddOrEdit} 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  modalType === 'reset' ? 'Reset Password' : 'Save'
                )}
              </button>
              <button 
                type="button"
                onClick={closeModal} 
                className="btn"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPerson;