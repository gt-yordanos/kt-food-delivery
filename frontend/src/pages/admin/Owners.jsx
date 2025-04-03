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

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentOwner, setCurrentOwner] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await axios.get(api.getAllRestaurantOwners, getAuthHeader());
      setOwners(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching data', error);
      setOwners([]);
    }
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

  const handleAddOrEdit = async () => {
    // Validation for 'add' or 'edit'
    if (modalType === 'add' || modalType === 'edit') {
      if (!currentOwner.name) {
        toast.error('Name is required');
        return;
      }

      if (!currentOwner.email || !/^\S+@\S+\.\S+$/.test(currentOwner.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Password validation only for add and edit actions
      if (modalType === 'add' && (!currentOwner.password || currentOwner.password.length < 6)) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }

    // Validation for 'reset' password
    if (modalType === 'reset') {
      if (!currentOwner.password || currentOwner.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      let response;
      if (modalType === 'edit') {
        response = await axios.put(api.updateRestaurantOwner.replace('{ownerId}', currentOwner._id), currentOwner, getAuthHeader());
        toast.success('Updated successfully!');
      } else if (modalType === 'reset') {
        response = await axios.put(api.updateRestaurantOwner.replace('{ownerId}', currentOwner._id), { password: currentOwner.password }, getAuthHeader());
        toast.success('Password reset successfully!');
      } else {
        response = await axios.post(api.addRestaurantOwner, currentOwner, getAuthHeader());
      }

      // Use the server response message if available
      const successMessage = response?.data?.message || 'Operation was successful!';
      toast.success(successMessage);

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
    setCurrentOwner({ name: '', email: '', password: '' });
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Restaurant Owners</h1>
      <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} className="input input-bordered w-full mb-4" />
      <button onClick={() => { setShowModal(true); setModalType('add'); setCurrentOwner({ name: '', email: '', password: '' }); }} className="btn btn-primary mb-4">
        <FaPlus /> Add Restaurant Owner
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
            {owners.map(owner => (
              <tr key={owner._id}>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>
                  <button onClick={() => { setCurrentOwner(owner); setModalType('edit'); setShowModal(true); }} className="btn btn-warning mr-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(owner._id)} className="btn btn-error mr-2">
                    {deleteLoading === owner._id ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                  <button onClick={() => { setCurrentOwner({ _id: owner._id, password: '' }); setModalType('reset'); setShowModal(true); }} className="btn btn-info">
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
              {modalType === 'edit' ? 'Edit' : modalType === 'reset' ? 'Reset Password' : 'Add'} Restaurant Owner
            </h2>
            {modalType !== 'reset' && (
              <>
                <input type="text" placeholder="Name" value={currentOwner.name} onChange={(e) => setCurrentOwner({ ...currentOwner, name: e.target.value })} className="input input-bordered w-full mb-2" />
                <input type="email" placeholder="Email" value={currentOwner.email} onChange={(e) => setCurrentOwner({ ...currentOwner, email: e.target.value })} className="input input-bordered w-full mb-2" />
              </>
            )}
            {modalType !== 'edit' && (
              <input type="password" placeholder="Password" value={currentOwner.password} onChange={(e) => setCurrentOwner({ ...currentOwner, password: e.target.value })} className="input input-bordered w-full mb-2" />
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

export default Owners;