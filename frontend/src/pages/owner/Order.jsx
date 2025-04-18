import React, { useState } from 'react';

const Order = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: 'ORD1001',
      customerName: 'John Doe',
      items: ['Laptop', 'Mouse'],
      totalAmount: '$1200',
      status: 'Processing',
    },
    {
      id: 2,
      orderId: 'ORD1002',
      customerName: 'Sara Johnson',
      items: ['Smartphone'],
      totalAmount: '$699',
      status: 'Confirmed',
    },
    {
      id: 3,
      orderId: 'ORD1003',
      customerName: 'Abdul Rahman',
      items: ['Headphones', 'Charger'],
      totalAmount: '$150',
      status: 'Shipped',
    },
  ]);

  const [loadingId, setLoadingId] = useState(null);

  const handleConfirmOrder = (id) => {
    setLoadingId(id);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: 'Confirmed' } : order
        )
      );
      setLoadingId(null);
    }, 1000);
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderId}</td>
                <td>{order.customerName}</td>
                <td>
                  <ul className="list-disc pl-4">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td>{order.totalAmount}</td>
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
                  {order.status === 'Processing' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleConfirmOrder(order.id)}
                      disabled={loadingId === order.id}
                    >
                      {loadingId === order.id ? (
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