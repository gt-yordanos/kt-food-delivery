import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../api'; // Import API routes

const DeliveryPerson = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: '', email: '', password: '' });
  const [editingPerson, setEditingPerson] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all delivery persons on load
  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    try {
      const response = await fetch(api.getAllDeliveryPersons);
      const data = await response.json();
      setDeliveryPersons(data);
    } catch (error) {
      console.error('Error fetching delivery persons:', error);
    }
  };

  const handleAddDeliveryPerson = async () => {
    if (!newPerson.name || !newPerson.email || !newPerson.password) {
      alert('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(api.addDeliveryPerson, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson),
      });

      const data = await response.json();
      if (response.ok) {
        setDeliveryPersons([...deliveryPersons, data.newDeliveryPerson]);
        setNewPerson({ name: '', email: '', password: '' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding delivery person:', error);
    }
    setLoading(false);
  };

  const handleEditDeliveryPerson = async () => {
    if (!editingPerson.name || !editingPerson.email) {
      alert('Name and Email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(api.updateDeliveryPerson.replace('{deliveryPersonId}', editingPerson._id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPerson),
      });

      if (response.ok) {
        setDeliveryPersons(deliveryPersons.map(person => (person._id === editingPerson._id ? editingPerson : person)));
        setEditingPerson(null);
      } else {
        alert('Failed to update');
      }
    } catch (error) {
      console.error('Error updating delivery person:', error);
    }
    setLoading(false);
  };

  const handleDeleteDeliveryPerson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery person?')) return;

    try {
      const response = await fetch(api.deleteDeliveryPerson.replace('{deliveryPersonId}', id), { method: 'DELETE' });

      if (response.ok) {
        setDeliveryPersons(deliveryPersons.filter(person => person._id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting delivery person:', error);
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4">Delivery People</h1>

      {/* Add New Delivery Person */}
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Name" 
          value={newPerson.name} 
          onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })} 
          className="input input-bordered"
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newPerson.email} 
          onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })} 
          className="input input-bordered"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={newPerson.password} 
          onChange={(e) => setNewPerson({ ...newPerson, password: e.target.value })} 
          className="input input-bordered"
        />
        <button className="btn btn-primary" onClick={handleAddDeliveryPerson} disabled={loading}>
          <FaPlus /> {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* Delivery Persons Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
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
                <td>
                  {editingPerson && editingPerson._id === person._id ? (
                    <input 
                      type="text" 
                      value={editingPerson.name} 
                      onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })} 
                      className="input input-bordered"
                    />
                  ) : person.name}
                </td>
                <td>
                  {editingPerson && editingPerson._id === person._id ? (
                    <input 
                      type="email" 
                      value={editingPerson.email} 
                      onChange={(e) => setEditingPerson({ ...editingPerson, email: e.target.value })} 
                      className="input input-bordered"
                    />
                  ) : person.email}
                </td>
                <td>
                  {editingPerson && editingPerson._id === person._id ? (
                    <>
                      <button className="btn btn-success mr-2" onClick={handleEditDeliveryPerson} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditingPerson(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning mr-2" onClick={() => setEditingPerson(person)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteDeliveryPerson(person._id)}>
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryPerson;