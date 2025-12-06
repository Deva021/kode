'use client';

import React from 'react';

interface BookButtonProps {
  price: number;
  unbookedSeats: number;
  onBook: () => void;
}

export default function BookButton({ price, unbookedSeats, onBook }: BookButtonProps) {
  const isLowSeats = unbookedSeats < 5;
  
  return (
    <button
      onClick={onBook}
      disabled={unbookedSeats === 0}
      className={`btn btn-sm ${
        unbookedSeats === 0 ? 'btn-error text-white disabled:bg-red-300 disabled:text-white' : 
        isLowSeats ? 'btn-warning text-white' : 
        'btn-primary'
      }`}
    >
      {unbookedSeats === 0 ? 'Full' : 'Book'}
    </button>
  );
}
