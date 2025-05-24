import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api';
import { toast } from 'react-toastify';
import { 
  FaCheckCircle, FaTimesCircle, FaShippingFast, FaCalendarAlt, 
  FaUser, FaBox, FaHome, FaPhone, FaEnvelope, FaIdCard, FaReceipt,
  FaHourglassHalf, FaUserClock, FaMapMarkerAlt
} from 'react-icons/fa';

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      navigate('/unauthorized');
      return;
    }
    fetchOrders();
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(api.getDeliveriesByCustomer, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      toast.error('Failed to load orders');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsReceived = async () => {
    try {
      await axios.put(
        api.verifyDeliveryByCustomer.replace('{deliveryId}', selectedOrder.delivery._id), 
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Order marked as received!');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error marking as received:', err);
      toast.error('Failed to mark as received');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error max-w-md">
          <FaTimesCircle className="text-xl" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-[5%] lg:px-[15%] bg-base-100 py-24">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          <FaBox className="text-xl" />
          <span>You don't have any orders yet.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => {
            // Check if this is a completed order with delivery data
            const isCompletedOrder = order.order?.status === 'completed';
            const hasDeliveryData = !!order.delivery;
            const deliveryStatus = hasDeliveryData ? (order.delivery?.deliveryStatus || 'pending') : 'pending';
            const customerVerified = hasDeliveryData ? (order.delivery?.customerVerified || false) : false;

            return (
              <div 
                key={order._id} 
                className="card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="card-body bg-base-300 rounded-xl">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Order Info */}
                    <div>
                      <h2 className="card-title flex items-center gap-2">
                        <FaReceipt /> Order #{order.order._id.slice(-6).toUpperCase()}
                      </h2>
                      <p className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt /> {new Date(order.order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex flex-wrap gap-2">
                      <div className={`badge gap-2 ${isCompletedOrder ? 'badge-success' : 'badge-warning'}`}>
                        {isCompletedOrder ? <FaCheckCircle /> : <FaHourglassHalf />}
                        {isCompletedOrder ? 'Order: Completed' : 'Order: Pending'}
                      </div>
                      {isCompletedOrder && (
                        <>
                          <div className={`badge gap-2 ${deliveryStatus === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                            {deliveryStatus === 'delivered' ? <FaShippingFast /> : <FaUserClock />}
                            {deliveryStatus === 'delivered' ? 'Delivery: Delivered' : 'Delivery: Pending'}
                          </div>
                          <div className={`badge gap-2 ${customerVerified ? 'badge-success' : 'badge-error'}`}>
                            {customerVerified ? <FaCheckCircle /> : <FaTimesCircle />}
                            {customerVerified ? 'Received: Yes' : 'Received: No'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {order.order.items.slice(0, 3).map((item, i) => (
                        <span key={i} className="badge badge-outline">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                      {order.order.items.length > 3 && (
                        <span className="badge badge-outline">
                          +{order.order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }} 
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaBox /> Order #{selectedOrder.order._id.slice(-6).toUpperCase()}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Order Summary Card */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title flex items-center gap-2">
                    <FaCalendarAlt /> Order Summary
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.order.createdAt).toLocaleString()}</p>
                    <p><strong>Order Status:</strong> 
                      <span className={`badge ml-2 ${selectedOrder.order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {selectedOrder.order.status === 'completed' ? 'Completed' : 'Pending Approval'}
                      </span>
                    </p>
                    <p><strong>Total:</strong> ${selectedOrder.order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title flex items-center gap-2">
                    <FaUser /> Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <FaIdCard /> {selectedOrder.customer.firstName} {selectedOrder.customer.middleName} {selectedOrder.customer.lastName}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaPhone /> {selectedOrder.customer.phoneNumber}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaEnvelope /> {selectedOrder.customer.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaHome /> {selectedOrder.customer.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="card bg-base-100 shadow mb-6">
              <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                  <FaBox /> Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.order.items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.priceAtPurchase.toFixed(2)} ETB each</p>
                      </div>
                      <div className="text-right">
                        <p>× {item.quantity}</p>
                        <p className="font-bold">{(item.priceAtPurchase * item.quantity).toFixed(2)} ETB</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-2 font-bold text-lg">
                    <span>Total</span>
                    <span>{selectedOrder.order.totalPrice.toFixed(2)} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {selectedOrder.order.status === 'completed' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delivery Address Card - Always show if order is completed */}
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title flex items-center gap-2">
                      <FaMapMarkerAlt /> Delivery Address
                    </h3>
                    <div className="space-y-2">
                      <p><strong>Campus:</strong> {selectedOrder.order.campus || 'Not specified'}</p>
                      <p><strong>Building:</strong> {selectedOrder.order.building || 'Not specified'}</p>
                      <p><strong>Room:</strong> {selectedOrder.order.roomNumber || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Status Card - Only show if delivery data exists */}
                {selectedOrder.delivery ? (
                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <h3 className="card-title flex items-center gap-2">
                        <FaShippingFast /> Delivery Status
                      </h3>
                      <div className="space-y-2">
                        <p><strong>Status:</strong> 
                          <span className={`badge ml-2 ${selectedOrder.delivery.deliveryStatus === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                            {selectedOrder.delivery.deliveryStatus || 'pending'}
                          </span>
                        </p>
                        {selectedOrder.delivery.deliveredAt && (
                          <p><strong>Delivered At:</strong> {new Date(selectedOrder.delivery.deliveredAt).toLocaleString()}</p>
                        )}
                        {selectedOrder.delivery.deliveryPerson && (
                          <>
                            <p><strong>Delivery Person:</strong> {selectedOrder.delivery.deliveryPerson.firstName} {selectedOrder.delivery.deliveryPerson.lastName}</p>
                            <p><strong>Contact:</strong> {selectedOrder.delivery.deliveryPerson.phoneNumber}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <FaHourglassHalf className="text-xl" />
                    <span>Delivery information will be available once your order is processed</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info">
                <FaHourglassHalf className="text-xl" />
                <span>Waiting for manager to approve your order placement. Delivery details will appear here once approved.</span>
              </div>
            )}

            {/* Verification Section - Only show if order is completed and has delivery data */}
            {selectedOrder.order.status === 'completed' && selectedOrder.delivery && (
              <div className="mt-6">
                {selectedOrder.delivery.deliveryStatus === 'delivered' ? (
                  selectedOrder.delivery.customerVerified ? (
                    <div className="alert alert-success">
                      <FaCheckCircle className="text-xl" />
                      <span>Order received and verified on {new Date(selectedOrder.delivery.deliveredAt).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      <div className="flex-1">
                        <FaTimesCircle className="text-xl" />
                        <label>Please confirm you received this order</label>
                      </div>
                      <button 
                        onClick={markAsReceived}
                        className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        Mark as Received
                      </button>
                    </div>
                  )
                ) : (
                  <div className="alert alert-info">
                    <FaHourglassHalf className="text-xl" />
                    <span>Order will be available for verification after delivery</span>
                  </div>
                )}
              </div>
            )}

            <div className="modal-action">
              <button onClick={() => setSelectedOrder(null)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;