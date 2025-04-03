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
    try {
      if (modalType === 'edit') {
        await axios.put(api.updateDeliveryPerson.replace('{deliveryPersonId}', currentPerson._id), currentPerson, getAuthHeader());
        toast.success('Updated successfully!');
      } else {
        await axios.post(api.addDeliveryPerson, currentPerson, getAuthHeader());
        toast.success('Added successfully!');
      }
      fetchDeliveryPersons();
      setShowModal(false);
    } catch (error) {
      toast.error('Error saving data!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(api.deleteDeliveryPerson.replace('{deliveryPersonId}', id), getAuthHeader());
      toast.success('Deleted successfully!');
      fetchDeliveryPersons();
    } catch (error) {
      toast.error('Error deleting data!');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Delivery Persons</h1>
      <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} className="input input-bordered w-full mb-4" />
      <button onClick={() => { setShowModal(true); setModalType('add'); }} className="btn btn-primary mb-4">
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
                  <button onClick={() => handleDelete(person._id)} className="btn btn-danger mr-2">
                    <FaTrash />
                  </button>
                  <button onClick={() => { setCurrentPerson(person); setModalType('reset'); setShowModal(true); }} className="btn btn-info">
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
            <h2 className="text-lg font-bold mb-4">{modalType === 'edit' ? 'Edit' : modalType === 'reset' ? 'Reset Password' : 'Add'} Delivery Person</h2>
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
              <button onClick={handleAddOrEdit} className="btn btn-success">Save</button>
              <button onClick={() => setShowModal(false)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPerson;