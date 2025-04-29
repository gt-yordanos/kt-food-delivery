import React from 'react';

const MenuCard = ({ image, name, description, price }) => {
  return (
    <div className="bg-base-200 rounded-4xl shadow-lg overflow-hidden flex flex-col">
      {/* Top: Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom: Info */}
      <div className="flex flex-col justify-between flex-1 p-4">
        {/* Name & Description */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-content">{name}</p>
          <p className="text-xs text-content">{description}</p>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-amber-500 font-bold text-sm">${price}</span>
          <button className="btn btn-md bg-base-100 text-amber-500 hover:bg-amber-500 hover:text-black rounded-full">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;