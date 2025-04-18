import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState({ name: '', description: '', price: '', category: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoadingTable(true);
    try {
      const response = await axios.get(api.getAllMenuItems, getAuthHeader());
      setMenuItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching menu items', error);
      setMenuItems([]);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredMenu = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery) || item.category.toLowerCase().includes(searchQuery)
  );

  const handleAddOrEdit = async () => {
    const { name, description, price, category, image } = currentItem;

    if (!name || !description || !price || !category) {
      toast.error('All fields except image are required.');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (modalType === 'edit') {
        response = await axios.put(
          api.updateMenuItem.replace('{menuId}', currentItem._id),
          currentItem,
          getAuthHeader()
        );
        toast.success('Menu item updated successfully!');
      } else {
        response = await axios.post(api.addMenuItem, currentItem, getAuthHeader());
        toast.success('Menu item added successfully!');
      }

      fetchMenuItems();
      closeModal();
    } catch (error) {
      toast.error('Error saving menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await axios.delete(api.deleteMenuItem.replace('{menuId}', id), getAuthHeader());
      toast.success('Menu item deleted');
      fetchMenuItems();
    } catch (error) {
      toast.error('Error deleting menu item');
    } finally {
      setDeleteLoading(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem({ name: '', description: '', price: '', category: '', image: '' });
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>
      <input type="text" placeholder="Search by name or category" value={searchQuery} onChange={handleSearch} className="input input-bordered w-full mb-4" />
      <button
        onClick={() => {
          setShowModal(true);
          setModalType('add');
          setCurrentItem({ name: '', description: '', price: '', category: '', image: '' });
        }}
        className="btn btn-primary mb-4"
      >
        <FaPlus /> Add Menu Item
      </button>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingTable ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              filteredMenu.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price}</td>
                  <td>{item.category}</td>
                  <td>
                    <button
                      onClick={() => {
                        setCurrentItem(item);
                        setModalType('edit');
                        setShowModal(true);
                      }}
                      className="btn btn-warning mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-error"
                    >
                      {deleteLoading === item._id ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <FaTrash />
                      )}
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
              {modalType === 'edit' ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={currentItem.name}
              onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={currentItem.description}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
              className="textarea textarea-bordered w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={currentItem.price}
              onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={currentItem.category}
              onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={currentItem.image}
              onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
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

export default Menu;