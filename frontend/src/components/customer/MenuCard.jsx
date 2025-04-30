import React from 'react';

const MenuCard = ({ image, name, description, price }) => {
  return (
    <div className="bg-base-300 rounded-[2rem] overflow-hidden flex flex-col justify-between
                    transition-all duration-300 ease-in-out mx-auto
                    aspect-[4/6] max-w-[20rem] min-w-[12rem] w-full group">
      
      {/* Image Section - taking half the height of the card */}
      <div className="w-full h-1/2 flex justify-center items-center overflow-hidden group-hover:scale-110 transition-transform duration-500 ease-in-out">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-col justify-between flex-1 py-8 px-4 md:p-4 w-full">
        <div className="mb-4">
          <p className="text-2xl md:text-lg font-semibold">{name}</p>
          <p className="text-lg md:text-xs">{description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-amber-500 font-bold text-xl md:text-sm">${price}</span>
          <button className="btn btn-large md:btn-sm bg-base-100 text-amber-500 hover:bg-amber-500 hover:text-black rounded-full">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;