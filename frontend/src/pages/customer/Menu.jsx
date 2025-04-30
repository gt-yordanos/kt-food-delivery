import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuCard from '../../components/customer/MenuCard';
import { useDebounce } from 'use-debounce';
import api from '../../api'; // Importing API constants

const foodCategories = [
  'Injera Dishes',
  'Vegetarian',
  'Grilled Meats',
  'Soups & Stews',
  'Breakfast',
  'Snacks & Street Food',
  'Beverages',
  'Salads & Sides',
  'Desserts',
  'Fast Food',
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500); // Debounced search input

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        let response;

        if (debouncedSearch.trim().length > 0) {
          // Search by name if input is non-empty
          response = await axios.get(api.searchAvailableMenuByName, {
            params: { name: debouncedSearch },
          });
        } else if (selectedCategory) {
          // Filter by category if no search input
          const url = api.getAvailableMenuByCategory.replace(
            '{category}',
            encodeURIComponent(selectedCategory)
          );
          response = await axios.get(url);
        } else {
          // Default: fetch all menu items
          response = await axios.get(api.getAvailableMenuItems);
        }

        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [selectedCategory, debouncedSearch]);

  return (
    <section className="py-12 px-4 sm:px-[5%] lg:px-[15%] bg-base-100">
      <div className="text-center mb-8 mt-10">
        <h4 className="text-lg text-amber-500 font-semibold">Our Menu</h4>
        <h2 className="text-3xl font-bold">Client Reviews About Our Food</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search for a dish..."
          className="px-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {foodCategories.map((category, index) => (
          <button
            key={index}
            onClick={() =>
              setSelectedCategory(category === selectedCategory ? null : category)
            }
            className={`w-12 h-12 flex justify-center items-center rounded-full text-white
              ${selectedCategory === category ? 'bg-amber-700 scale-110' : 'bg-amber-500'}
              hover:bg-amber-600 transition-all duration-300`}
          >
            {category.charAt(0)}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.length === 0 ? (
          <p className="col-span-full text-center text-lg text-gray-500">No menu items found.</p>
        ) : (
          menuItems.map((item, index) => (
            <MenuCard
              key={index}
              image={`${item.image}?t=${index}`}
              name={item.name}
              description={item.description}
              price={item.price}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Menu;