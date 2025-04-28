import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 px-4 sm:px-[5%] lg:px-[15%]">
      <div className="container-box flex flex-col items-center justify-center text-center bg-base-200 rounded-4xl shadow-lg p-6">
        <Clock className="w-8 h-8 text-amber-500 mb-4" />
        <h3 className="text-xl font-semibold">11:00 am - 8:00 pm</h3>
        <p className="text-amber-500 hover:text-amber-600 mt-2 cursor-pointer">
          Working Hours
        </p>
      </div>

      <div className="container-box flex flex-col items-center justify-center text-center bg-base-200 rounded-4xl shadow-lg p-6">
        <MapPin className="w-8 h-8 text-amber-500 mb-4" />
        <h3 className="text-xl font-semibold">Inside the HU Stadium</h3>
        <p className="text-amber-500 hover:text-amber-600 mt-2 cursor-pointer">
          Get Directions
        </p>
      </div>

      <div className="container-box flex flex-col items-center justify-center text-center bg-base-200 rounded-4xl shadow-lg p-6">
        <Phone className="w-8 h-8 text-amber-500 mb-4" />
        <h3 className="text-xl font-semibold">(+251) 97667767</h3>
        <p className="text-amber-500 hover:text-amber-600 mt-2 cursor-pointer">
          Call Us Now
        </p>
      </div>
    </section>
  );
};

export default ContactInfo;