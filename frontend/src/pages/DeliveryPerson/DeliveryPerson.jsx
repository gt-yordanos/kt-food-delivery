import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/DeliveryPerson/Navbar';
import api from '../../api';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClipboardCheck,
  FaListAlt,
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DeliveryPersonPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    deliveryStatus: '',
    customerVerification: '',  // Change 'customerVerified' to 'customerVerification'
  });
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    if (user) fetchDeliveries();
  }, [filters, user]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDeliveries = async () => {
    setLoading(true);
    let url = '';

    if (!filters.deliveryStatus && !filters.customerVerification) {
      url = api.getDeliveriesByPerson.replace('{deliveryPersonId}', user.id);
    } else if (filters.deliveryStatus && filters.customerVerification) {
      url = api.getDeliveriesByPersonStatusAndVerification
        .replace(':status', filters.deliveryStatus)
        .replace(':customerVerified', filters.customerVerification) // Updated to customerVerification
        .replace(':personId', user.id);
    } else if (filters.deliveryStatus) {
      url = api.getDeliveriesByPersonAndStatus
        .replace(':status', filters.deliveryStatus)
        .replace(':personId', user.id);
    } else if (filters.customerVerification) {  // Updated to customerVerification
      url = api.getDeliveriesByPersonAndCustomerVerification
        .replace(':customerVerified', filters.customerVerification) // Updated to customerVerification
        .replace(':personId', user.id);
    }

    try {
      const response = await axios.get(url, { headers: getAuthHeader() });
      setDeliveries(response.data);
    } catch (error) {
      console.error(
        'Error fetching deliveries:',
        error.response ? error.response.data : error.message
      );
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryStatusUpdate = async (deliveryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this delivery as 'delivered'?"
    );
    if (!confirmed) return;

    try {
      const url = api.updateDeliveryStatus.replace('{deliveryId}', deliveryId);
      await axios.patch(
        url,
        { status: 'delivered' },
        { headers: getAuthHeader() }
      );
      fetchDeliveries();
    } catch (error) {
      console.error(
        'Error updating delivery status:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleRowClick = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleCloseModal = () => {
    setSelectedDelivery(null);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar filters={filters} setFilters={setFilters} />

      <div className="overflow-x-auto p-4">
        <table className="table table-zebra text-xs w-full">
          <thead>
            <tr className="text-xs"> {/* Decreased text size */}
              <th className="sm:hidden">First Name</th>
              <th className="hidden sm:table-cell">Full Name</th>
              <th className="sm:table-cell hidden">Phone</th>
              <th className="sm:table-cell hidden">Email</th>
              <th>Items</th>
              <th className="sm:table-cell hidden">Campus</th>
              <th className="sm:table-cell hidden">Building</th>
              <th className="sm:table-cell hidden">Room No</th>
              <th className="sm:table-cell hidden">Status</th>
              <th className="sm:table-cell hidden">Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  <span className="loading loading-spinner text-content w-8 h-8"></span>
                </td>
              </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr
                  key={delivery._id}
                  onClick={() => handleRowClick(delivery)}
                  className="cursor-pointer"
                >
                  <td className="sm:hidden">{delivery.customer.firstName}</td>
                  <td className="hidden sm:table-cell">
                    {`${delivery.customer.firstName} ${delivery.customer.middleName} ${delivery.customer.lastName}`}
                  </td>
                  <td className="sm:table-cell hidden">
                    <a href={`tel:${delivery.customer.phoneNumber}`}>
                      {delivery.customer.phoneNumber}
                    </a>
                  </td>
                  <td className="sm:table-cell hidden">
                    <a href={`mailto:${delivery.customer.email}`}>
                      {delivery.customer.email}
                    </a>
                  </td>
                  <td>
                    <ul>
                      {(delivery.order?.items || []).map((item) => (
                        <li key={item._id}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="sm:table-cell hidden">{delivery.order?.campus || '-'}</td>
                  <td className="sm:table-cell hidden">{delivery.order?.building || '-'}</td>
                  <td className="sm:table-cell hidden">{delivery.order?.roomNumber || '-'}</td>
                  <td className="sm:table-cell hidden">{delivery.deliveryStatus}</td>
                  <td className="sm:table-cell hidden">
                    {delivery.customerVerified ? 'Verified' : 'Not Verified'}
                  </td>
                  <td>
                    {delivery.deliveryStatus === 'delivered' ? (
                      <span>No Action Needed</span>
                    ) : (
                      <button
                        className="btn btn-success btn-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeliveryStatusUpdate(delivery._id);
                        }}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {deliveries.length === 0 && !loading && (
          <div className="text-center py-4">No deliveries found.</div>
        )}
      </div>

      {selectedDelivery && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-200 bg-opacity-50 z-50 sm:hidden">
          <div className="bg-base-100 p-6 rounded-lg w-11/12 sm:w-1/2">
            <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
            <div className="flex items-center mb-2">
              <FaListAlt className="mr-2" />
              <p>
                <strong>Customer:</strong>{' '}
                {`${selectedDelivery.customer.firstName} ${selectedDelivery.customer.middleName} ${selectedDelivery.customer.lastName}`}
              </p>
            </div>
            <div className="flex items-center mb-2">
              <FaEnvelope className="mr-2" />
              <a href={`mailto:${selectedDelivery.customer.email}`}>
                <strong>Email:</strong> {selectedDelivery.customer.email}
              </a>
            </div>
            <div className="flex items-center mb-2">
              <FaPhoneAlt className="mr-2" />
              <a href={`tel:${selectedDelivery.customer.phoneNumber}`}>
                <strong>Phone:</strong> {selectedDelivery.customer.phoneNumber}
              </a>
            </div>
            <div className="flex items-center mb-2">
              <FaClipboardCheck className="mr-2" />
              <p>
                <strong>Delivery Status:</strong> {selectedDelivery.deliveryStatus}
              </p>
            </div>
            <div className="flex items-center mb-2">
              <FaClipboardCheck className="mr-2" />
              <p>
                <strong>Customer Verification:</strong>{' '}
                {selectedDelivery.customerVerified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <p><strong>Campus:</strong> {selectedDelivery.order?.campus}</p>
            </div>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <p><strong>Building:</strong> {selectedDelivery.order?.building}</p>
            </div>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <p><strong>Room Number:</strong> {selectedDelivery.order?.roomNumber}</p>
            </div>
            <h3 className="mt-4 font-semibold">Items:</h3>
            <ul>
              {selectedDelivery.order?.items?.map((item) => (
                <li key={item._id}>
                  {item.name} (x{item.quantity})
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button className="btn btn-sm" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryPersonPage;