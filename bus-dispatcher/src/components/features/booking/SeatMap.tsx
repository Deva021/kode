'use client';

import React from 'react';
import clsx from 'clsx';

interface SeatMapProps {
  totalSeats: number;
  bookedSeats: number[];
  selectedSeats: number[];
  onSelect?: (seatNumber: number) => void;
  readOnly?: boolean;
}

export default function SeatMap({
  totalSeats,
  bookedSeats,
  selectedSeats,
  onSelect,
  readOnly = false,
}: SeatMapProps) {
  // Generate seat numbers 1 to totalSeats
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Seat Map</h3>
        <div className="flex gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-white border border-gray-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gray-300 cursor-not-allowed"></div>
            <span>Booked/Reserved</span>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-blue-600"></div>
              <span>Selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Driver Area */}
      <div className="flex justify-end mb-8 px-4">
        <div className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-400">
          <span className="text-[10px] font-bold uppercase">Driver</span>
        </div>
      </div>

      {/* Better Grid Layout Implementation */}
      <div className="mt-8 flex justify-center">
        <div className="grid grid-cols-2 gap-8">
           {/* Left Column (Seats 1, 2, 5, 6...) */}
           <div className="grid grid-cols-2 gap-2">
              {seats.filter(s => (s - 1) % 4 < 2).map(seatNumber => (
                 <SeatButton 
                    key={seatNumber}
                    seatNumber={seatNumber}
                    isBooked={bookedSeats.includes(seatNumber)}
                    isSelected={selectedSeats.includes(seatNumber)}
                    readOnly={readOnly}
                    onSelect={onSelect}
                 />
              ))}
           </div>

           {/* Right Column (Seats 3, 4, 7, 8...) */}
           <div className="grid grid-cols-2 gap-2">
              {seats.filter(s => (s - 1) % 4 >= 2).map(seatNumber => (
                 <SeatButton 
                    key={seatNumber}
                    seatNumber={seatNumber}
                    isBooked={bookedSeats.includes(seatNumber)}
                    isSelected={selectedSeats.includes(seatNumber)}
                    readOnly={readOnly}
                    onSelect={onSelect}
                 />
              ))}
           </div>
        </div>
      </div>
      
      {/* Legend/Info for Customer */}
      {readOnly && (
        <div className="mt-6 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg text-center">
          <p>Login as an Agent to confirm reservations.</p>
        </div>
      )}
    </div>
  );
}

function SeatButton({ seatNumber, isBooked, isSelected, readOnly, onSelect }: any) {
  return (
    <button
      type="button"
      disabled={isBooked || readOnly}
      onClick={() => onSelect && onSelect(seatNumber)}
      className={clsx(
        'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200',
        {
          'bg-gray-200 text-gray-400 cursor-not-allowed': isBooked,
          'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105': isSelected,
          'bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600':
            !isBooked && !isSelected && !readOnly,
          'bg-white border border-gray-200 text-gray-400 cursor-default':
            !isBooked && !isSelected && readOnly,
        }
      )}
    >
      {seatNumber}
    </button>
  );
}
