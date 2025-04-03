import React from 'react';

const Restaurant = () => {
  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4">Restaurants</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Restaurant Name</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Restaurant Row */}
            <tr>
              <td>Pasta Palace</td>
              <td>Mike Johnson</td>
              <td>Active</td>
              <td>
                <button className="btn btn-primary">View</button>
                <button className="btn btn-danger ml-2">Suspend</button>
              </td>
            </tr>
            {/* Add more restaurant rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Restaurant;