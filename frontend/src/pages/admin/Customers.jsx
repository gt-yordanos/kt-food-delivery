import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaKey } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

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

  const handleAddOrEdit = async () => {
    if (modalType === 'add' || modalType === 'edit') {
      if (!currentCustomer.firstName || !currentCustomer.lastName) {
        toast.error('First and Last name are required');
        return;
      }
      if (!currentCustomer.email || !/^\S+@\S+\.\S+$/.test(currentCustomer.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      if (!currentCustomer.phoneNumber || !/^\d{10}$/.test(currentCustomer.phoneNumber)) {
        toast.error('Please enter a valid phone number');
        return;
      }
      if (modalType === 'add' && (!currentCustomer.password || currentCustomer.password.length < 6)) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      let response;
      if (modalType === 'edit') {
        const { password, ...dataToUpdate } = currentCustomer;
        response = await axios.put(
          api.updateCustomer.replace('{customerId}', currentCustomer._id),
          dataToUpdate,
          getAuthHeader()
        );
        toast.success('Updated successfully!');
      } else if (modalType === 'reset') {
        if (!currentCustomer.password || currentCustomer.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return;
        }
        await axios.put(
          api.updateCustomer.replace('{customerId}', currentCustomer._id),
          { password: currentCustomer.password },
          getAuthHeader()
        );        
        toast.success('Password reset successfully!');
      } else {
        response = await axios.post(api.create, currentCustomer, getAuthHeader());
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
                        setCurrentCustomer(customer);
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
                        setCurrentCustomer({ _id: customer._id, password: '' });
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
          <div className="modal-box">
            <h2 className="text-lg font-bold mb-4">
              {modalType === 'edit'
                ? 'Edit'
                : modalType === 'reset'
                ? 'Reset Password'
                : 'Add'}{' '}
              Customer
            </h2>
            {modalType !== 'reset' && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  value={currentCustomer.firstName}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, firstName: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Middle Name"
                  value={currentCustomer.middleName}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, middleName: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={currentCustomer.lastName}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, lastName: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={currentCustomer.email}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, email: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={currentCustomer.phoneNumber}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, phoneNumber: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={currentCustomer.address}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, address: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                />
              </>
            )}
            {modalType !== 'edit' && (
              <input
                type="password"
                placeholder="Password"
                value={currentCustomer.password}
                onChange={(e) =>
                  setCurrentCustomer({ ...currentCustomer, password: e.target.value })
                }
                className="input input-bordered w-full mb-2"
              />
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