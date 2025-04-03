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
  const [currentPerson, setCurrentPerson] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    try {
      const response = await axios.get(api.getAllDeliveryPersons, getAuthHeader());
      setDeliveryPersons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching data', error);
      setDeliveryPersons([]);
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
      if (!currentPerson.name) {
        toast.error('Name is required');
        return;
      }
  
      if (!currentPerson.email || !/^\S+@\S+\.\S+$/.test(currentPerson.email)) {
        toast.error('Please enter a valid email address');
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
  
      // Use the server response message if available
      const successMessage = response?.data?.message || 'Operation was successful!';
      toast.success(successMessage);
  
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
    setCurrentPerson({ name: '', email: '', password: '' });
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Delivery Persons</h1>
      <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} className="input input-bordered w-full mb-4" />
      <button onClick={() => { setShowModal(true); setModalType('add'); setCurrentPerson({ name: '', email: '', password: '' }); }} className="btn btn-primary mb-4">
        <FaPlus /> Add Delivery Person
      </button>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryPersons.map(person => (
              <tr key={person._id}>
                <td>{person.name}</td>
                <td>{person.email}</td>
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
            ))}
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
                <input type="text" placeholder="Name" value={currentPerson.name} onChange={(e) => setCurrentPerson({ ...currentPerson, name: e.target.value })} className="input input-bordered w-full mb-2" />
                <input type="email" placeholder="Email" value={currentPerson.email} onChange={(e) => setCurrentPerson({ ...currentPerson, email: e.target.value })} className="input input-bordered w-full mb-2" />
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