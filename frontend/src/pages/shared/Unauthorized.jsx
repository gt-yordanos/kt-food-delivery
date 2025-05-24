import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaExclamationTriangle, FaHome, FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'manager') {
      navigate('/manager/dashboard');
    } else if (user?.role === 'deliveryPerson') {
      navigate('/delivery-person');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-2xl p-8">
        <div className="text-center">
          <FaLock className="text-6xl text-error mb-4 mx-auto" />
          <h1 className="text-3xl font-bold text-base-content mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-base-content mb-4">
            You are not authorized to view this page or perform this action.
          </p>
          <p className="text-md text-base-content mb-6">
            Your role: <span className="font-semibold">{user?.role || 'Guest'}</span>
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleGoBack}
              className="btn btn-warning text-black px-6 py-2 rounded-lg shadow hover:scale-105 transition"
            >
              <FaHome className="mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition"
            >
              <FaExclamationTriangle className="mr-2" />
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
