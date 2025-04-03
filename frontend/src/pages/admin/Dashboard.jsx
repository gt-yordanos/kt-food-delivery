import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card w-full bg-primary text-primary-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Customers</h2>
            <p>800</p>
          </div>
        </div>
        <div className="card w-full bg-secondary text-secondary-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Active Owners</h2>
            <p>32</p>
          </div>
        </div>
        <div className="card w-full bg-accent text-accent-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Active Deliveries</h2>
            <p>45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;