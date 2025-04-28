import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import heroImage from '../../assets/heroImage.jpeg';

const Hero = () => {
  return (
    <section id="home" className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-20 px-4 sm:px-[5%] lg:px-[15%] mt-12">
      <div className="home-img flex justify-center order-first md:order-last">
        <div className="rounded-full border-8 border-amber-500 p-2 transition-transform duration-500 hover:scale-105">
          <img
            src={heroImage}
            alt="Shiro"
            className="w-80 h-80 object-cover rounded-full shadow-lg"
          />
        </div>
      </div>

      <div className="home-text flex flex-col justify-center text-center md:text-left order-last md:order-first">
        <h1 className="text-3xl sm:text-4xl font-semibold text-content mb-2 sm:mb-12 leading-[5rem]">
          <span className="text-red-400">ከሚወዱት ሰዉ ጋር</span> ወደ እኛ ይምጡ
          <span className="text-amber-500"> ይብሉ ፣</span> ይጠጡ ፣ ያጣጥሙ ይደሰቱ
        </h1>
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

export default Hero;