import React from 'react';
import ClientCard from './ClientCard';

const ClientReviews = () => {
  const clients = [
    {
      name: "Yordanos Genene",
      image: "ClientImage/IMG_7031.jpeg",
      review: "The shiro at KT Restaurant was simply amazing, packed with flavor and served with injera, it's an absolute must-try!",
      rating: 5
    },
    {
      name: "Mekdes Tsegaye",
      image: "ClientImage/IMG_7031.jpeg",
      review: "Beyaynetu at KT Restaurant brought back memories of home; the variety of dishes, including injera and lentils, were all delicious and authentic.",
      rating: 4
    },
    {
      name: "Tewodros Mekonnen",
      image: "ClientImage/IMG_7031.jpeg",
      review: "The tibs at KT Restaurant were perfectly seasoned and tender, making for a delightful meal that I'll definitely come back for.",
      rating: 5
    },
    {
      name: "Selamawit Desta",
      image: "ClientImage/IMG_7031.jpeg",
      review: "Firfir at KT Restaurant was a delightful surprise; the combination of spices and textures made it a standout dish for me.",
      rating: 5
    },
    // Add more if needed
  ];

  return (
    <section className="py-12 px-4 sm:px-[5%] lg:px-[15%] bg-base-100" id="review">
      <div className="text-center mb-8">
        <h4 className="text-lg text-amber-500 font-semibold">Our Customer</h4>
        <h2 className="text-3xl font-bold">Client Reviews About Our Food</h2>
      </div>

      {/* Responsive grid: xs-1, sm-2, md-3, lg-4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {clients.map((client, index) => (
          <ClientCard key={index} {...client} />
        ))}
      </div>
    </section>
  );
};

export default ClientReviews;