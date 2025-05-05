import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [filters, setFilters] = useState({
    campus: '',
    person: '',
    orderId: '',
    status: '',
  });

  // Fetch delivery persons
  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const response = await axios.get(api.getAllDeliveryPersons, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setDeliveryPersons(response.data);
      } catch (error) {
        console.error('Error fetching delivery persons:', error);
      }
    };

    fetchDeliveryPersons();
  }, []);

  // Fetch deliveries when filters change
  useEffect(() => {
    fetchDeliveries();
  }, [filters]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      let response;

      // Check if any filter is applied, if not, fetch all deliveries
      if (filters.orderId) {
        const url = api.getDeliveriesByOrderId.replace('{orderId}', filters.orderId);
        response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setDeliveries(response.data ? [response.data] : []);
      } else if (filters.person) {
        const url = api.getDeliveriesByPerson.replace('{deliveryPersonId}', filters.person);
        response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setDeliveries(Array.isArray(response.data) ? response.data : []);
      } else if (filters.campus) {
        const url = api.getDeliveriesByCampus.replace('{campus}', filters.campus);
        response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setDeliveries(Array.isArray(response.data) ? response.data : []);
      } else if (filters.status) {
        const url = api.getDeliveriesByStatus.replace('{status}', filters.status);
        response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setDeliveries(Array.isArray(response.data) ? response.data : []);
      } else {
        // If no filters are selected, fetch all deliveries
        response = await axios.get(api.getAllDeliveries, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setDeliveries(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Clear other filters if one is selected
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };

      if (name !== 'campus') newFilters.campus = ''; // Clear campus when other filters are selected
      if (name !== 'person') newFilters.person = ''; // Clear person when other filters are selected
      if (name !== 'orderId') newFilters.orderId = ''; // Clear orderId when other filters are selected
      if (name !== 'status') newFilters.status = ''; // Clear status when other filters are selected

      return newFilters;
    });
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
            className="select select-bordered select-sm"
          >
            <option value="">Select Campus</option>
            <option value="CVM">CVM</option>
            <option value="Main">Main</option>
            <option value="HiT">HiT</option>
          </select>

          <select
            name="person"
            value={filters.person}
            onChange={handleFilterChange}
            className="select select-bordered select-sm"
          >
            <option value="">Select Delivery Person</option>
            {deliveryPersons.map((person) => (
              <option key={person._id} value={person._id}>
                {person.firstName} {person.lastName} ({person.campus})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="orderId"
            value={filters.orderId}
            onChange={handleFilterChange}
            placeholder="Order ID"
            className="input input-bordered input-sm"
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="select select-bordered select-sm"
          >
            <option value="">Select Status</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra table-sm w-full">
          <thead>
            <tr className="text-xs">
              <th>Customer Name</th>
              <th>Delivery Person</th>
              <th>Campus</th>
              <th>Building</th>
              <th>Dorm Number</th>
              <th>Phone Number</th>
              <th>Items</th>
              <th>Status</th>
              <th>Customer Verified</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : deliveries.length > 0 ? (
              deliveries.map((item) => (
                <tr key={item._id}>
                  <td>{item.customer?.firstName} {item.customer?.lastName}</td>
                  <td>{item.deliveryPerson?.firstName} {item.deliveryPerson?.lastName}</td>
                  <td>{item.deliveryPerson?.campus}</td> {/* Make sure this is populated in the response */}
                  <td>{item.order?.building}</td>
                  <td>{item.order?.roomNumber}</td>
                  <td>{item.customer?.phoneNumber}</td>
                  <td>
                    {item.order?.items?.map((orderItem, index) => (
                      <div key={index}>{orderItem.name} (x{orderItem.quantity})</div>
                    ))}
                  </td>
                  <td>
                    <span
                      className={`badge ${item.deliveryStatus === 'delivered' ? 'badge-success' : 'badge-warning'}`}
                    >
                      {item.deliveryStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${item.customerVerified ? 'badge-success' : 'badge-error'}`}
                    >
                      {item.customerVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  {/* Show message only when no filters are applied and no deliveries are available */}
                  {filters.campus || filters.person || filters.orderId || filters.status
                    ? 'No deliveries found matching your criteria'
                    : 'No deliveries available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Delivery;