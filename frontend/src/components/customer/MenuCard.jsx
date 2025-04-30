import React from 'react';

const MenuCard = ({ image, name, description, price, loading = false }) => {
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
          <div className="w-full h-1/2 flex justify-center items-center overflow-hidden group-hover:scale-110 transition-transform duration-500 ease-in-out">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-between flex-1 py-8 px-4 md:p-4 w-full">
            <div className="mb-4">
              <p className="text-2xl lg:text-lg font-semibold">{name}</p>
              <p className="text-lg lg:text-xs">{description}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-amber-500 font-bold text-xl lg:text-sm">${price}</span>
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