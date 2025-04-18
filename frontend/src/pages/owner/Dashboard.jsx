import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const totalCustomers = 800;
  const totalMenu = 120;
  const totalCustomersThisWeek = 40;
  const totalDeliveriesThisWeek = 35;
  const totalOrdersThisWeek = 300;
  const totalOrdersToday = 45;
  const totalDeliveriesToday = 30;

  const topOrderedItems = ['Burger', 'Pizza', 'Fries', 'Pasta', 'Fried Chicken'];
  const topRatedFoods = ['Sushi', 'Steak', 'Cheesecake', 'Tacos', 'Grilled Salmon'];
  const mostHatedFoods = ['Burnt Toast', 'Cold Soup', 'Salty Fries', 'Raw Chicken', 'Overcooked Rice'];

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Customers',
        data: [50, 60, 70, 80, 85, 90, 100, 110, 120, 130, 140, 150],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Orders',
        data: [200, 220, 240, 250, 270, 280, 300, 310, 350, 400, 420, 450],
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        borderColor: 'rgb(234, 88, 12)',
        borderWidth: 1,
      },
    ],
  };

  const yearlyData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Customers',
        data: [500, 600, 700, 800, 900],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Orders',
        data: [1800, 2100, 2500, 2800, 3200],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-primary">Restaurant Owner Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Total Customers</h2>
            <p>{totalCustomers}</p>
          </div>
        </div>

        <div className="card bg-secondary text-secondary-content">
          <div className="card-body">
            <h2 className="card-title">Total Menu Items</h2>
            <p>{totalMenu}</p>
          </div>
        </div>

        <div className="card bg-accent text-accent-content">
          <div className="card-body">
            <h2 className="card-title">Orders This Week</h2>
            <p>{totalOrdersThisWeek}</p>
          </div>
        </div>

        <div className="card bg-warning text-warning-content">
          <div className="card-body">
            <h2 className="card-title">Orders Today</h2>
            <p>{totalOrdersToday}</p>
          </div>
        </div>

        <div className="card bg-success text-success-content">
          <div className="card-body">
            <h2 className="card-title">Deliveries This Week</h2>
            <p>{totalDeliveriesThisWeek}</p>
          </div>
        </div>

        <div className="card bg-error text-error-content">
          <div className="card-body">
            <h2 className="card-title">Deliveries Today</h2>
            <p>{totalDeliveriesToday}</p>
          </div>
        </div>

        <div className="card bg-info text-info-content">
          <div className="card-body">
            <h2 className="card-title">New Customers This Week</h2>
            <p>{totalCustomersThisWeek}</p>
          </div>
        </div>
      </div>

      {/* Extra Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title text-lg font-bold">Top 5 Ordered Items</h2>
            <ul className="list-disc list-inside">
              {topOrderedItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card bg-green-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-lg font-bold">Top Rated Foods</h2>
            <ul className="list-disc list-inside">
              {topRatedFoods.map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card bg-red-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-lg font-bold">Most Hated Foods</h2>
            <ul className="list-disc list-inside">
              {mostHatedFoods.map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Monthly Growth (Last 12 Months)</h2>
        <div className="bg-base-200 p-4 rounded-lg shadow-lg">
          <Bar data={monthlyData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Yearly Growth (Last 5 Years)</h2>
        <div className="bg-base-200 p-4 rounded-lg shadow-lg">
          <Bar data={yearlyData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;