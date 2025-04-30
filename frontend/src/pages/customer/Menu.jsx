import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuCard from '../../components/customer/MenuCard';
import { useDebounce } from 'use-debounce';
import api from '../../api';

// ✅ Import images directly
import injera from '../../assets/category/injera.webp';
import vegetarian from '../../assets/category/vegetarian.webp';
import grilled from '../../assets/category/grilled.jpg';
import soups from '../../assets/category/soups.jpg';
import breakfast from '../../assets/category/breakfast.jpg';
import snacks from '../../assets/category/snacks.webp';
import beverages from '../../assets/category/beverages.jpg';
import salads from '../../assets/category/salads.jpg';
import desserts from '../../assets/category/desserts.jpg';
import fastfood from '../../assets/category/fastfood.jpg';

// ✅ Use imported images here
const foodCategories = [
  { name: 'Injera Dishes', image: injera },
  { name: 'Vegetarian', image: vegetarian },
  { name: 'Grilled Meats', image: grilled },
  { name: 'Soups & Stews', image: soups },
  { name: 'Breakfast', image: breakfast },
  { name: 'Snacks & Street Food', image: snacks },
  { name: 'Beverages', image: beverages },
  { name: 'Salads & Sides', image: salads },
  { name: 'Desserts', image: desserts },
  { name: 'Fast Food', image: fastfood },
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        let response;

        if (debouncedSearch.trim().length > 0) {
          response = await axios.get(api.searchAvailableMenuByName, {
            params: { name: debouncedSearch },
          });
        } else if (selectedCategory) {
          const url = api.getAvailableMenuByCategory.replace(
            '{category}',
            encodeURIComponent(selectedCategory)
          );
          response = await axios.get(url);
        } else {
          response = await axios.get(api.getAvailableMenuItems);
        }

        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory, debouncedSearch]);

  return (
    <section className="py-12 px-4 sm:px-[5%] lg:px-[15%] bg-base-100">
      <div className="text-center mb-8 mt-10">
        <h4 className="text-lg text-amber-500 font-semibold">Our Menu</h4>
      </div>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search for a dish..."
          className="w-full sm:w-96 md:w-[500px] px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="overflow-x-auto hide-scrollbar mb-10">
        <div className="flex gap-6 w-max px-2">
          {foodCategories.map((cat, index) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <button
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : cat.name)
                  }
                  className={`w-16 h-16 rounded-full overflow-hidden shadow-sm border ${
                    isSelected
                      ? 'border-2 border-emerald-500'
                      : 'border-2 border-amber-500'
                  } transition-all duration-200`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full hover:transform hover:scale-105 transition-transform duration-200"
                  />
                </button>
                <span className="mt-1 text-xs font-medium text-content w-20 truncate">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <MenuCard key={i} loading={true} />
            ))
          : menuItems.length === 0 ? (
              <p className="col-span-full text-center text-lg text-gray-500">
                No menu items found.
              </p>
            ) : (
              menuItems.map((item, index) => (
                <MenuCard
                  key={index}
                  image={`${BASE_URL}${item.image}`}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  item={item} // Pass the item data here
                />
              ))
            )}
      </div>
    </section>
  );
};

export default Menu;