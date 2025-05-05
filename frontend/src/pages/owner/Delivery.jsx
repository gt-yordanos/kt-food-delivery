import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios
import api from '../../api';  // Assuming api.js contains your endpoints

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]); // Default state to an empty array
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    campus: '',
    person: '',
    orderId: '',
  });
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (filters.campus || filters.person || filters.orderId) {
      fetchDeliveries();
    }
  }, [filters]);

  // Fetch deliveries based on current filters
  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      let url = api.getDeliveriesByCampus.replace('{campus}', filters.campus || 'CVM'); // Default campus to CVM if none selected
      if (filters.orderId) {
        url = api.getDeliveriesByOrderId.replace('{orderId}', filters.orderId);
      } else if (filters.person) {
        url = api.getDeliveriesByPerson.replace('{deliveryPersonId}', filters.person);
      }

      // Use axios for API request with Authorization
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming token is stored in localStorage
        },
      });

      // Ensure response data is an array
      const deliveriesData = Array.isArray(response.data) ? response.data : [];
      console.log("Fetched Deliveries:", deliveriesData); // Log the fetched data
      setDeliveries(deliveriesData);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update for a delivery
  const handleStatusUpdate = async (id) => {
    setLoadingId(id);
    try {
      const response = await axios.put(
        api.updateDeliveryStatus.replace('{deliveryId}', id),
        { status: 'Delivered' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Token for authorization
          },
        }
      );

      const updatedDelivery = response.data;  // Updated delivery data from the server
      setDeliveries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: 'Delivered' } : item))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoadingId(null);
    }
  };

  // Handle input changes for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Delivery Status</h1>

      {/* Filters */}
      <div className="mb-4">
        <div className="flex space-x-4">
          <select
            name="campus"
            value={filters.campus}
            onChange={handleFilterChange}
            className="select select-bordered"
          >
            <option value="">Select Campus</option>
            <option value="CVM">CVM</option>
            <option value="Main">Main</option>
            <option value="HiT">HiT</option>
          </select>

          <input
            type="text"
            name="person"
            value={filters.person}
            onChange={handleFilterChange}
            placeholder="Delivery Person ID"
            className="input input-bordered"
          />

          <input
            type="text"
            name="orderId"
            value={filters.orderId}
            onChange={handleFilterChange}
            placeholder="Order ID"
            className="input input-bordered"
          />

          <button
            onClick={fetchDeliveries}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Filter'}
          </button>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading deliveries...
                </td>
              </tr>
            ) : (
              deliveries.map((item) => (
                <tr key={item._id}> {/* Use _id or a unique identifier */}
                  <td>{item.order?.orderId}</td>
                  <td>{item.order?.customerName}</td>
                  <td>{item.order?.deliveryAddress}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.deliveryStatus === 'Delivered' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {item.deliveryStatus}
                    </span>
                  </td>
                  <td>
                    {item.deliveryStatus !== 'Delivered' && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(item._id)} // Use _id or the unique identifier
                        disabled={loadingId === item._id}
                      >
                        {loadingId === item._id ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          'Mark Delivered'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Delivery;