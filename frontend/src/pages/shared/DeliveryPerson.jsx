import React from 'react';

const DeliveryPerson = () => {
  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4">Delivery People</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Delivery Person Row */}
            <tr>
              <td>Mike Johnson</td>
              <td>Bike</td>
              <td>Available</td>
              <td>
                <button className="btn btn-primary">View</button>
                <button className="btn btn-danger ml-2">Suspend</button>
              </td>
            </tr>
            {/* Add more delivery person rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryPerson;