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
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [fetching, setFetching] = useState(true); // Added loading state for fetching data

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    setFetching(true); // Set loading to true before starting the fetch
    try {
      const response = await axios.get(api.getAllDeliveryPersons, getAuthHeader());
      setDeliveryPersons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching data', error);
      setDeliveryPersons([]);
    } finally {
      setFetching(false); // Set loading to false after the fetch is completed
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    try {
      const response = await axios.get(`${api.searchDeliveryPerson}?query=${query}`, getAuthHeader());
      setDeliveryPersons(response.data);
    } catch (error) {
      console.error('Error searching data', error);
      setDeliveryPersons([]);
    }
  };

  const handleAddOrEdit = async () => {
    // Validation for 'add' or 'edit'
    if (modalType === 'add' || modalType === 'edit') {
      if (!currentPerson.firstName || !currentPerson.lastName) {
        toast.error('First and Last name are required');
        return;
      }
  
      if (!currentPerson.email || !/^\S+@\S+\.\S+$/.test(currentPerson.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      if (!currentPerson.phoneNumber || !/^\d{10}$/.test(currentPerson.phoneNumber)) {
        toast.error('Please enter a valid phone number');
        return;
      }
  
      // Password validation only for add and edit actions
      if (modalType === 'add' && (!currentPerson.password || currentPerson.password.length < 6)) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }
  
    // Validation for 'reset' password
    if (modalType === 'reset') {
      if (!currentPerson.password || currentPerson.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }
  
    setLoading(true);
    try {
      let response;
      if (modalType === 'edit') {
        response = await axios.put(api.updateDeliveryPerson.replace('{deliveryPersonId}', currentPerson._id), currentPerson, getAuthHeader());
        toast.success('Updated successfully!');
      } else if (modalType === 'reset') {
        response = await axios.put(api.updateDeliveryPerson.replace('{deliveryPersonId}', currentPerson._id), { password: currentPerson.password }, getAuthHeader());
        toast.success('Password reset successfully!');
      } else {
        response = await axios.post(api.addDeliveryPerson, currentPerson, getAuthHeader());
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
    setDeleteLoading(id);
    try {
      await axios.delete(api.deleteDeliveryPerson.replace('{deliveryPersonId}', id), getAuthHeader());
      toast.success('Deleted successfully!');
      fetchDeliveryPersons();
    } catch (error) {
      toast.error('Error deleting data!');
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
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Delivery Persons</h1>
      <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} className="input input-bordered w-full mb-4" />
      <button onClick={() => { setShowModal(true); setModalType('add'); setCurrentPerson({ firstName: '', middleName: '', lastName: '', email: '', password: '', phoneNumber: '', campus: '' }); }} className="btn btn-primary mb-4">
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
                <td colSpan="3" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              deliveryPersons.map(person => (
                <tr key={person._id}>
                  <td>{person.firstName} {person.middleName} {person.lastName}</td>
                  <td>{person.phoneNumber}</td>
                  <td>{person.email}</td>
                  <td>{person.campus}</td>
                  <td>
                    <button onClick={() => { setCurrentPerson(person); setModalType('edit'); setShowModal(true); }} className="btn btn-warning mr-2">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(person._id)} className="btn btn-error mr-2">
                      {deleteLoading === person._id ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                    <button onClick={() => { setCurrentPerson({ _id: person._id, password: '' }); setModalType('reset'); setShowModal(true); }} className="btn btn-info">
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
              {modalType === 'edit' ? 'Edit' : modalType === 'reset' ? 'Reset Password' : 'Add'} Delivery Person
            </h2>
            {modalType !== 'reset' && (
              <>
                <input type="text" placeholder="First Name" value={currentPerson.firstName} onChange={(e) => setCurrentPerson({ ...currentPerson, firstName: e.target.value })} className="input input-bordered w-full mb-2" />
                <input type="text" placeholder="Middle Name" value={currentPerson.middleName} onChange={(e) => setCurrentPerson({ ...currentPerson, middleName: e.target.value })} className="input input-bordered w-full mb-2" />
                <input type="text" placeholder="Last Name" value={currentPerson.lastName} onChange={(e) => setCurrentPerson({ ...currentPerson, lastName: e.target.value })} className="input input-bordered w-full mb-2" />
                <input type="email" placeholder="Email" value={currentPerson.email} onChange={(e) => setCurrentPerson({ ...currentPerson, email: e.target.value })} className="input input-bordered w-full mb-2" />
                <input type="text" placeholder="Phone Number" value={currentPerson.phoneNumber} onChange={(e) => setCurrentPerson({ ...currentPerson, phoneNumber: e.target.value })} className="input input-bordered w-full mb-2" />
                <select value={currentPerson.campus} onChange={(e) => setCurrentPerson({ ...currentPerson, campus: e.target.value })} className="input input-bordered w-full mb-2">
                  <option value="">Select Campus</option>
                  <option value="Main">Main</option>
                  <option value="HiT">HiT</option>
                  <option value="CVM">CVM</option>
                </select>
              </>
            )}
            {modalType !== 'edit' && (
              <input type="password" placeholder="Password" value={currentPerson.password} onChange={(e) => setCurrentPerson({ ...currentPerson, password: e.target.value })} className="input input-bordered w-full mb-2" />
            )}
            <div className="modal-action">
              <button onClick={handleAddOrEdit} className="btn btn-success">
                {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
              </button>
              <button onClick={closeModal} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPerson;