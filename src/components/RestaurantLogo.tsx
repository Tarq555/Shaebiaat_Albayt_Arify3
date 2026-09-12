import React from 'react';

interface RestaurantLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  isDarkBg?: boolean;
}

export const RestaurantLogo: React.FC<RestaurantLogoProps> = ({
  className = '',
  size = 52,
  isDarkBg = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden select-none ${
        isDarkBg ? 'bg-white' : 'bg-transparent'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/restaurant_logo.jpg"
        alt="شعار البيت الريفي - ALBAYT ALRIYFI"
        className="w-full h-full object-contain rounded-full"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default RestaurantLogo;
