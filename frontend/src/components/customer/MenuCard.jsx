import React, { useState, useEffect } from 'react';
import { FaCartPlus, FaCheckCircle } from 'react-icons/fa'; // Importing icons
import { useCart } from '../../contexts/CartContext';  // Import useCart hook

const MenuCard = ({ image, name, description, price, item, loading = false }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, removeFromCart, cart } = useCart();  // Access addToCart and removeFromCart from context

  // Guard clause to prevent accessing properties of an undefined item
  useEffect(() => {
    if (item) {
      const isItemInCart = cart.some((cartItem) => cartItem._id === item._id);
      setAddedToCart(isItemInCart);
    }
  }, [cart, item]); // Re-run whenever cart or item._id changes

  const handleToggleCart = () => {
    if (addedToCart) {
      removeFromCart(item._id);
    } else {
      addToCart(item);
    }
    setAddedToCart(!addedToCart);
  };

  return (
    <div className="bg-base-300 rounded-[2rem] overflow-hidden flex flex-col justify-between
                    transition-all duration-300 ease-in-out mx-auto
                    aspect-[4/6] max-w-[20rem] min-w-[12rem] w-full group">

      {loading ? (
        <div className="flex w-52 flex-col gap-4 p-4 mx-auto">
          <div className="skeleton h-36 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full mb-6"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ) : (
        <>
          {/* Image Section */}
          <div className="relative w-full h-1/2 flex justify-center items-center overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />

            {/* Add to Cart Button */}
            <button
              onClick={handleToggleCart}
              className={`flex items-center btn btn-large lg:btn-sm rounded-full absolute top-3 left-2 transition-all duration-200 ${addedToCart
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-base-100 text-amber-500 hover:bg-amber-500 hover:text-black'
              }`}
            >
              {addedToCart ? (
                <>
                  <FaCheckCircle className="h-6 w-6 lg:h-5 lg:w-5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <FaCartPlus className="h-6 w-6 lg:h-5 lg:w-5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-between flex-1 py-8 px-4 md:p-4 w-full">
            <div className="mb-4">
              <p className="text-2xl lg:text-lg font-semibold">{name}</p>
              <p className="text-lg lg:text-xs">{description}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-amber-500 font-bold text-xl lg:text-sm">{price} ETB.</span>
              <button className="btn btn-large lg:btn-sm bg-base-100 text-amber-500 hover:bg-amber-500 hover:text-black rounded-full">
                Order Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuCard;