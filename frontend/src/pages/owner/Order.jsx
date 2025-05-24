import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryPersons, setDeliveryPersons] = useState({});
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);

  // Fetch orders based on status
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url =
        selectedStatus === 'all'
          ? api.getAllOrders
          : api.getOrdersByStatus.replace('{status}', selectedStatus);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders. Status: ' + response.status);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setError('Unexpected data format');
      }
    } catch (err) {
      setError('Error: ' + err.message);
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch delivery persons based on campus
  const fetchDeliveryPersons = async (campus) => {
    try {
      const url = api.getActiveDeliveryPersonsByCampus.replace(
        '{campus}',
        campus
      );

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        setDeliveryPersons((prev) => ({
          ...prev,
          [campus]: [],
        }));
        return;
      }

      const data = await response.json();
      setDeliveryPersons((prev) => ({
        ...prev,
        [campus]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      console.error('Error fetching delivery persons:', err);
      setDeliveryPersons((prev) => ({
        ...prev,
        [campus]: [],
      }));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  useEffect(() => {
    if (orders.length > 0) {
      const campuses = [...new Set(orders.map((order) => order.campus))];
      campuses.forEach((campus) => fetchDeliveryPersons(campus));
    }
  }, [orders]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const handleAssignDeliveryPerson = async (orderId, deliveryPersonId) => {
    if (!deliveryPersonId) {
      toast.warning('Please select a delivery person');
      return;
    }

    try {
      const response = await fetch(api.createDelivery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          orderId,
          deliveryPersonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign delivery person');
      }

      const data = await response.json();
      toast.success(data.message);
      fetchOrders();
    } catch (err) {
      setError('Error assigning delivery person: ' + err.message);
      toast.error('Error assigning delivery person: ' + err.message);
    }
  };

  const copyToClipboard = (orderId) => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard!');
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="mb-4">
        <label htmlFor="status" className="mr-2 font-semibold">
          Filter by Status:
        </label>
        <select
          id="status"
          className="select select-bordered select-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-xs">
          <thead>
            <tr className="text-xs">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Campus</th>
              <th>Status</th>
              <th>Order Time</th>
              <th>Assign Delivery</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-10">
                  <div className="loading loading-spinner loading-sm"></div>
                  <span className="ml-2">Loading...</span>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-10 text-gray-500 text-sm">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="text-xs">
                  <td className="py-2">
                    <button
                      className="btn btn-xs text-[9px] btn-outline hover:bg-emerald-500 hover:text-black"
                      onClick={() => copyToClipboard(order._id)}
                    >
                      Copy ID
                    </button>
                  </td>
                  <td className="py-2">{order.customer?.firstName} {order.customer?.lastName}</td>
                  <td className="py-2">
                    <ul className="list-disc pl-4">
                      {order.items.map((item, index) => (
                        <li key={index} className="py-0.5">
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2">{order.totalPrice?.toLocaleString()} ETB</td>
                  <td className="py-2">
                    <span
                      className={`badge badge-sm ${
                        order.paymentStatus === 'paid' ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2">{order.campus}</td>
                  <td className="py-2">
                    <span
                      className={`badge badge-sm ${
                        order.status === 'completed'
                          ? 'badge-success'
                          : order.status === 'inProgress'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="py-2">
                    {order.status === 'completed' ? (
                      <span className="text-success">Assigned</span>
                    ) : (
                      order.status === 'inProgress' && (
                        <div className="flex flex-col space-y-1">
                          {deliveryPersons[order.campus]?.length > 0 ? (
                            <>
                              <select
                                onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                                className="select select-bordered select-sm text-xs"
                              >
                                <option value="">Select Delivery</option>
                                {deliveryPersons[order.campus]?.map((person) => (
                                  <option key={person._id} value={person._id}>
                                    {person.firstName} {person.lastName} ({person.deliveries.length})
                                  </option>
                                ))}
                              </select>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => handleAssignDeliveryPerson(order._id, selectedDeliveryPerson)}
                              >
                                Assign
                              </button>
                            </>
                          ) : (
                            <div className="text-error text-xs">
                              No delivery person available for this campus
                            </div>
                          )}
                        </div>
                      )
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

export default Order;