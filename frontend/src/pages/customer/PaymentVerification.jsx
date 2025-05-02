import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentVerification = () => {
  const { tx_ref } = useParams(); // Get tx_ref from URL
  const [orderStatus, setOrderStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to verify payment status
    const verifyPaymentStatus = async () => {
      try {
        const response = await axios.get(`/api/payments/chapa/verify/${tx_ref}`);
        if (response.data.status === 'paid') {
          setOrderStatus('Payment Successful');
        } else {
          setOrderStatus('Payment Failed');
        }
      } catch (err) {
        setError('Error verifying payment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [tx_ref]);

  const handleGoToOrders = () => {
    // Navigate the user back to the orders page after payment verification
    navigate('/orders'); // Use navigate instead of history.push
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-center">Payment Verification</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="spinner-border animate-spin border-t-2 border-blue-600 w-8 h-8 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          ) : (
            <div className="alert alert-success">
              <span>{orderStatus}</span>
            </div>
          )}
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary" onClick={handleGoToOrders}>
              Go to Orders Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;