import React, { useState, useEffect } from 'react';
import api from '../../api';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await fetch(api.getAllOrders, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders. Status: ' + response.status);
      }

      const data = await response.json();
      console.log(data); // Log the response data
      if (Array.isArray(data)) {
        setOrders(data);
        console.log(orders)
      } else {
        setError('Unexpected data format');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  useEffect(() => {
    fetchOrders(); // Call the fetchOrders function on component mount
  }, []);

  const handleConfirmOrder = (id) => {
    setLoadingId(id);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: 'Confirmed' } : order
        )
      );
      setLoadingId(null);
    }, 1000);
  };

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!Array.isArray(orders)) {
    return <div>Loading or No Orders Found</div>;
  }

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>
                  <ul className="list-disc pl-4">
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </td>
                <td>{order.totalPrice}</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === 'Confirmed'
                        ? 'badge-success'
                        : order.status === 'Shipped'
                        ? 'badge-info'
                        : 'badge-warning'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'inProgress' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleConfirmOrder(order._id)}
                      disabled={loadingId === order._id}
                    >
                      {loadingId === order._id ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Confirm'
                      )}
                    </button>
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

export default Order;