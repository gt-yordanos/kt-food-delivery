import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Mock Data for the statistics
  const totalCustomers = 800;
  const totalDeliveryPeople = 45;
  const totalCustomersThisWeek = 40;
  const totalDeliveriesThisWeek = 35;
  const totalOrdersThisWeek = 300;
  const totalOrdersToday = 45;
  const totalDeliveriesToday = 30;
  const totalMenu = 120; // Mock data for total menu items

  // Mock Data for Monthly Growth (Last 12 months)
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Customers (Last 12 months)',
        data: [50, 60, 70, 80, 85, 90, 100, 110, 120, 130, 140, 150],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Orders (Last 12 months)',
        data: [200, 220, 240, 250, 270, 280, 300, 310, 350, 400, 420, 450],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Delivery People (Last 12 months)',
        data: [20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 85, 90],
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  // Mock Data for Yearly Growth (Last 5 years)
  const yearlyData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Customers (Last 5 years)',
        data: [500, 600, 700, 800, 900],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Orders (Last 5 years)',
        data: [1800, 2100, 2500, 2800, 3200],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Delivery People (Last 5 years)',
        data: [40, 45, 50, 60, 75],
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-[100vh] overflow-y-auto">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Customers Card */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Customers</h2>
            <p>{totalCustomers}</p>
          </div>
        </div>

        {/* Total Delivery People Card */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Delivery People</h2>
            <p>{totalDeliveryPeople}</p>
          </div>
        </div>

        {/* Total Menu Items Card */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Menu Items</h2>
            <p>{totalMenu}</p>
          </div>
        </div>

        {/* Total Customers This Week */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Customers This Week</h2>
            <p>{totalCustomersThisWeek}</p>
          </div>
        </div>

        {/* Total Deliveries This Week */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Deliveries This Week</h2>
            <p>{totalDeliveriesThisWeek}</p>
          </div>
        </div>

        {/* Total Orders This Week */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Orders This Week</h2>
            <p>{totalOrdersThisWeek}</p>
          </div>
        </div>

        {/* Total Orders Today */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Orders Today</h2>
            <p>{totalOrdersToday}</p>
          </div>
        </div>

        {/* Total Deliveries Today */}
        <div className="card bg-base-200 border border-gray-300 text-base-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Total Deliveries Today</h2>
            <p>{totalDeliveriesToday}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart for Monthly Growth (Last 12 months) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Growth Over the Last 12 Months</h2>
        <div className="bg-base-100 p-4 border border-gray-300 rounded-lg shadow-lg">
          <Bar data={monthlyData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Bar Chart for Yearly Growth (Last 5 years) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Growth Over the Last 5 Years</h2>
        <div className="bg-base-100 p-4 border border-gray-300 rounded-lg shadow-lg">
          <Bar data={yearlyData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;