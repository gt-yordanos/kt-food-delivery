import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const foodCategories = [
  'Injera Dishes',
  'Vegetarian',
  'Grilled Meats',
  'Soups & Stews',
  'Breakfast',
  'Snacks & Street Food',
  'Beverages',
  'Salads & Sides',
  'Desserts',
  'Fast Food',
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState({
    name: '',
    description: '',
    price: '',
    category: [],
    available: true,
    image: '',
    _id: null,
  });
  const [imageFile, setImageFile] = useState(null);
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

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery) ||
    item.category.join(' ').toLowerCase().includes(searchQuery)
  );

  const handleAddOrEdit = async () => {
    const { name, description, price, category } = currentItem;

    if (!name || !description || !price || category.length === 0) {
      toast.error('All fields except image are required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      category.forEach(cat => formData.append('category', cat));
      formData.append('available', currentItem.available);
      if (imageFile) formData.append('image', imageFile);

      let response;

      if (modalType === 'edit') {
        response = await axios.put(
          api.updateMenuItem.replace('{menuId}', currentItem._id),
          formData,
          {
            ...getAuthHeader(),
            headers: {
              ...getAuthHeader().headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        toast.success('Menu item updated successfully!');
      } else {
        response = await axios.post(api.addMenuItem, formData, {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Menu item added successfully!');
      }

      fetchMenuItems();
      closeModal();
    } catch (error) {
      toast.error('Error saving menu item');
      console.error(error);
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

  const handleAvailabilityToggle = async (id, currentAvailability) => {
    try {
      const newAvailability = !currentAvailability;
      await axios.put(
        api.updateMenuItemAvailability.replace('{menuId}', id),
        { available: newAvailability },
        getAuthHeader()
      );
      toast.success(`Menu item ${newAvailability ? 'available' : 'unavailable'}`);
      fetchMenuItems();
    } catch (error) {
      toast.error('Error updating availability');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem({
      name: '',
      description: '',
      price: '',
      category: [],
      available: true,
      image: '',
      _id: null,
    });
    setImageFile(null);
  };

  const handleCategorySelect = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory && !currentItem.category.includes(selectedCategory)) {
      setCurrentItem({
        ...currentItem,
        category: [...currentItem.category, selectedCategory],
      });
    }
  };

  const handleCategoryRemove = (categoryToRemove) => {
    setCurrentItem({
      ...currentItem,
      category: currentItem.category.filter((cat) => cat !== categoryToRemove),
    });
  };

  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>
      <input
        type="text"
        placeholder="Search by name or category"
        value={searchQuery}
        onChange={handleSearch}
        className="input input-bordered w-full mb-4"
      />
      <button
        onClick={() => {
          setShowModal(true);
          setModalType('add');
          setCurrentItem({
            name: '',
            description: '',
            price: '',
            category: [],
            available: true,
            image: '',
            _id: null,
          });
          setImageFile(null);
        }}
        className="btn btn-primary mb-4"
      >
        <FaPlus /> Add Menu Item
      </button>

      {/* Table container */}
      <div className="overflow-x-auto hide-scrollbar">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="table table-zebra w-full">
            <thead className="sticky top-0 bg-base-200 z-10">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingTable ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                  </td>
                </tr>
              ) : (
                filteredMenu.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.image ? (
                        <img
                          src={`${BASE_URL}${item.image}`}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : 'No Image'}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price} ETB</td>
                    <td>{item.category.join(', ')}</td>
                    <td>
                      <input
                        type="checkbox"
                        defaultChecked={item.available}
                        className="toggle"
                        onChange={() =>
                          handleAvailabilityToggle(item._id, item.available)
                        }
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setModalType('edit');
                          setShowModal(true);
                          setImageFile(null);
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
      </div>

      {/* Modal */}
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

            <select
              className="input input-bordered w-full mb-2"
              onChange={handleCategorySelect}
              value=""
            >
              <option value="">Select Category</option>
              {foodCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="mb-4">
              {currentItem.category.map((category, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full py-1 px-3 mr-2 mb-2"
                >
                  <span>{category}</span>
                  <FaTimes
                    className="ml-2 cursor-pointer"
                    onClick={() => handleCategoryRemove(category)}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center mb-2">
              <label htmlFor="availability" className="mr-2">Availability:</label>
              <input
                type="checkbox"
                className="toggle"
                checked={currentItem.available}
                onChange={() => setCurrentItem({ ...currentItem, available: !currentItem.available })}
              />
            </div>

            <label htmlFor="image" className="mb-2">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="file-input file-input-bordered w-full mb-2"
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