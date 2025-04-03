import React from 'react';

const Customers = () => {
  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4">Customers</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Customer Row */}
            <tr>
              <td>John Doe</td>
              <td>johndoe@example.com</td>
              <td>+1 234 567 890</td>
              <td>
                <button className="btn btn-primary">View</button>
                <button className="btn btn-danger ml-2">Delete</button>
              </td>
            </tr>
            {/* Add more customer rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;