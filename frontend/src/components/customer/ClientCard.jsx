import React from 'react';

const ClientCard = ({ name, image, review, rating }) => {
  return (
    <div className="card bg-base-200 shadow-md rounded-2xl">
      <div className="card-body py-6 px-10 md:px-6">
        <p className="text-content text-xs">{review}</p>
        <div className="flex items-center ">
          <div className="avatar mt-2">
            <div className="w-12 rounded-full">
              <img src={image} alt={name} />
            </div>
          </div>
          <div className="ml-3">
            <h4 className="font-bold">{name}</h4>
            <div className="rating rating-sm mt-1">
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type="radio"
                  name={`rating-${name}-${i}`}
                  className={`mask mask-star-2 ${i < rating ? 'bg-amber-500' : 'bg-gray-300'}`}
                  aria-label={`${i + 1} star`}
                  disabled
                  checked={i < rating}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;