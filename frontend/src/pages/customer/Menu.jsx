import React from 'react';
import MenuCard from '../../components/customer/MenuCard';
import tibsImage from '../../assets/tibs.jpg';
import kikilImage from '../../assets/kikil.webp';

const sampleMenu = [
  {
    image: tibsImage,
    name: 'Tibs',
    description: 'Sautéed meat with spices, served with injera.',
    price: 14.99,
  },
  {
    image: kikilImage,
    name: 'Veggie Delight',
    description: 'Fresh vegetables served with hummus and pita.',
    price: 9.49,
  },
  {
    image: 'https://via.placeholder.com/300x200',
    name: 'Beef Steak',
    description: 'Tender steak grilled to perfection.',
    price: 18.5,
  },
  {
    image: 'https://via.placeholder.com/300x200',
    name: 'Beef Steak',
    description: 'Tender steak grilled to perfection.',
    price: 18.5,
  },
];

const Menu = () => {
  return (
    <section className="py-12 px-4 sm:px-[5%] lg:px-[15%] bg-base-100">
      <div className="text-center mb-8 mt-10">
        <h4 className="text-lg text-amber-500 font-semibold">Our Menu</h4>
        <h2 className="text-3xl font-bold">Client Reviews About Our Food</h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sampleMenu.map((item, index) => (
          <MenuCard
            key={index}
            image={item.image}
            name={item.name}
            description={item.description}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
};

export default Menu;