import React from 'react';

export default function ChecklistLogo({ size = 38 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 44 44" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(15,23,42,0.06))' }}
    >
      {/* Light themed clean card container */}
      <rect width="44" height="44" rx="11" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      
      {/* Row 1: Checked Circle + Bar */}
      <circle cx="13" cy="13" r="5" fill="#2563EB" />
      <path d="M10.8 13L12.4 14.6L15.4 11.4" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="22" y="10.5" width="14" height="5" rx="2.5" fill="#0F172A" />

      {/* Row 2: Hollow circle + Bar */}
      <circle cx="13" cy="22" r="4.2" stroke="#64748B" strokeWidth="1.6" fill="#F8FAFC" />
      <rect x="22" y="19.5" width="14" height="5" rx="2.5" fill="#64748B" />

      {/* Row 3: Hollow circle + Bar */}
      <circle cx="13" cy="31" r="4.2" stroke="#94A3B8" strokeWidth="1.6" fill="#F8FAFC" />
      <rect x="22" y="28.5" width="14" height="5" rx="2.5" fill="#94A3B8" />
    </svg>
  );
}
