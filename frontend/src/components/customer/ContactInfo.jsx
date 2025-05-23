import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useRestaurant } from '../../contexts/RestaurantContext';

// Format time to 12-hour format with AM/PM
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hour, minute] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Determine restaurant open status
const isRestaurantOpen = (openingHours) => {
  if (!openingHours) return { status: 'closed', nextTime: null };

  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const todayHours = openingHours[currentDay];

  if (!todayHours) return { status: 'closed', nextTime: null };

  const [startHour, startMinute] = todayHours.start.split(':').map(Number);
  const [endHour, endMinute] = todayHours.end.split(':').map(Number);

  const start = new Date(now);
  start.setHours(startHour, startMinute, 0);

  const end = new Date(now);
  end.setHours(endHour, endMinute, 0);

  if (now >= start && now < end) {
    return { status: 'open', nextTime: todayHours.end };
  } else {
    return { status: 'closed', nextTime: todayHours.start };
  }
};

const SkeletonCard = ({ icon: Icon, label }) => (
  <div className="container-box flex flex-col items-center justify-between text-center bg-base-200 rounded-4xl shadow-lg p-6 h-full">
    <Icon className="w-8 h-8 text-amber-500 mb-4" />
    <div className="flex w-52 flex-col gap-4">
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-[55%]"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
    <p className="text-amber-500 hover:text-amber-600 mt-2 cursor-pointer">{label}</p>
  </div>
);

const ContactInfo = () => {
  const { restaurant, loading, error } = useRestaurant();

  const showSkeleton = loading || error || !restaurant;

  let statusText = '';
  if (!showSkeleton && restaurant.openingHours) {
    const openStatus = isRestaurantOpen(restaurant.openingHours);
    statusText =
      openStatus.status === 'open'
        ? `Now open · Closes at ${formatTime(openStatus.nextTime)}`
        : `Now closed · Opens at ${formatTime(openStatus.nextTime)}`;
  }

  return (
    <section className="mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 px-4 sm:px-[5%] lg:px-[15%]">
      {showSkeleton ? (
        <>
          <SkeletonCard icon={Clock} label="Working Hours" />
          <SkeletonCard icon={MapPin} label="Get Directions" />
          <SkeletonCard icon={Phone} label="Call Us Now" />
        </>
      ) : (
        <>
          {/* Working Hours */}
          <div className="container-box flex flex-col items-center justify-between text-center bg-base-200 rounded-4xl shadow-lg p-6 h-full">
            <Clock className="w-8 h-8 text-amber-500 mb-4" />
            <p className="text-md font-semibold">{statusText}</p>
            <p className="text-amber-500 hover:text-amber-600 mt-2 cursor-pointer">Working Hours</p>
          </div>

          {/* Address */}
          <div className="container-box flex flex-col items-center justify-between text-center bg-base-200 rounded-4xl shadow-lg p-6 h-full">
            <MapPin className="w-8 h-8 text-amber-500 mb-4" />
            <p className="text-md font-semibold">{restaurant.address}</p>
            <p className="text-amber-500 hover:text-amber-600 mt-2 cursor-pointer">Get Directions</p>
          </div>

          {/* Phone */}
          <div className="container-box flex flex-col items-center justify-between text-center bg-base-200 rounded-4xl shadow-lg p-6 h-full">
            <Phone className="w-8 h-8 text-amber-500 mb-4" />
            <p className="text-md font-semibold">{restaurant.phone}</p>
            <p className="text-amber-500 hover:text-amber-600 mt-2 cursor-pointer">Call Us Now</p>
          </div>
        </>
      )}
    </section>
  );
};

export default ContactInfo;