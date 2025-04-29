import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import aboutImage from '../../assets/aboutImage.jpeg'; // Import the image from assets

const About = () => {
  return (
    <section id="about" className="pt-26 pb-18 px-4 sm:px-[5%] lg:px-[15%] flex flex-col-reverse md:flex-row items-center gap-8">
      <div className="about-img flex-1">
        <img
          src={aboutImage}
          alt="KT Restaurant"
          className="shadow-lg object-cover w-[90%] h-[90%] rounded-br-[40%] rounded-tl-[30%] rounded-bl-[30%] transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="about-text flex-1 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
          Living well begins <br /> with eating well
        </h2>
        <p className="text-base text-base-content mb-6">
          At KT Restaurant, our dedication lies in providing the beloved campus community
          with delicious fare at affordable prices, ensuring that every student feels at home
          away from home. <br /> <br />
          KT Restaurant is more than just a dining spot; it's a haven where good food meets
          affordability, and where the warmth of home is always on the menu.
        </p>
        <Link
          to="/menu"
          className="mt-6 text-lg text-amber-500 bg-base-300 px-6 py-3 rounded-full hover:bg-amber-500 hover:text-black transition-all ease-in duration-300 w-60 flex items-center justify-center font-bold mx-auto md:mx-0"
        >
          Explore Menu <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default About;