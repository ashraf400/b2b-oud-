import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative ${className} group`}>
      <svg 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl transition-transform duration-500 group-hover:rotate-[5deg]"
      >
        {/* Luxury Outer Ring */}
        <circle cx="60" cy="60" r="56" stroke="url(#goldGradient)" strokeWidth="0.5" className="opacity-30" />
        <circle cx="60" cy="60" r="52" stroke="url(#goldGradient)" strokeWidth="1" className="opacity-20" strokeDasharray="4 4" />

        {/* The Dehn Al Oud Drop Base */}
        <path 
          d="M60 105C72.1503 105 82 95.1503 82 83C82 74.5 72 58 60 40C48 58 38 74.5 38 83C38 95.1503 47.8497 105 60 105Z" 
          fill="url(#goldGradient)"
          className="filter drop-shadow-lg"
        />

        {/* Integrated Arabic Calligraphy Style (Abstractly framing the brand) */}
        <path 
          d="M40 30C50 20 70 20 80 30M35 50C40 40 80 40 85 50" 
          stroke="url(#goldGradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          className="opacity-40"
        />

        {/* Minimalist Brand Name integration below/within */}
        <text 
          x="60" 
          y="25" 
          textAnchor="middle" 
          fill="#D4AF37" 
          style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'serif' }}
          className="select-none"
        >
          مورد
        </text>
        <text 
          x="60" 
          y="118" 
          textAnchor="middle" 
          fill="#D4AF37" 
          style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'serif' }}
          className="select-none"
        >
          الطيب
        </text>

        {/* Glistening Highlight on the drop */}
        <ellipse cx="52" cy="75" rx="4" ry="8" fill="white" fillOpacity="0.3" transform="rotate(-15 52 75)" />

        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4AF37" />
            <stop offset="0.3" stopColor="#F9E29C" />
            <stop offset="0.6" stopColor="#B8860B" />
            <stop offset="1" stopColor="#8A6D1C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
