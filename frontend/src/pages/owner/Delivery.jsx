import React, { useState } from 'react';

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      orderId: 'ORD123',
      customerName: 'John Doe',
      deliveryAddress: '123 Main Street, Addis Ababa',
      status: 'Pending',
    },
    {
      id: 2,
      orderId: 'ORD456',
      customerName: 'Jane Smith',
      deliveryAddress: '456 Bole Road, Addis Ababa',
      status: 'In Transit',
    },
    {
      id: 3,
      orderId: 'ORD789',
      customerName: 'Abebe Kebede',
      deliveryAddress: '789 Piassa Avenue, Addis Ababa',
      status: 'Delivered',
    },
  ]);

  const [loadingId, setLoadingId] = useState(null);

  const handleStatusUpdate = (id) => {
    setLoadingId(id);
    setTimeout(() => {
      setDeliveries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'Delivered' } : item
        )
      );
      setLoadingId(null);
    }, 1000);
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Delivery Status</h1>
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
            {deliveries.map((item) => (
              <tr key={item.id}>
                <td>{item.orderId}</td>
                <td>{item.customerName}</td>
                <td>{item.deliveryAddress}</td>
                <td>
                  <span
                    className={`badge ${
                      item.status === 'Delivered'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status !== 'Delivered' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusUpdate(item.id)}
                      disabled={loadingId === item.id}
                    >
                      {loadingId === item.id ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Mark Delivered'
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

export default Delivery;