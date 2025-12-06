'use client';

import React, { useState } from 'react';
import { ScheduleWithRoute } from '@/lib/api';
import { Clock, MapPin, Bus, Users } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/buttons';
import BookingModal from '../booking/BookingModal';
import BookButton from '../schedule/BookButton';

interface ScheduleCardProps {
  schedule: ScheduleWithRoute;
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { route, departure_time, bus_plate_number, total_seats, booked_seats } = schedule;
  const unbooked_seats = total_seats - booked_seats;

  const handleBook = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        {/* Header with Route */}
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex items-center gap-2 mb-1 opacity-90 text-sm">
            <MapPin size={16} />
            <span>{route.origin}</span>
          </div>
          <h3 className="text-xl font-bold">{route.destination}</h3>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          {/* Time & Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Departure</p>
              <p className="font-semibold text-gray-900">
                {new Date(departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(departure_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Bus Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Bus size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bus Plate</p>
              <p className="font-medium text-gray-900">{bus_plate_number}</p>
            </div>
          </div>

          {/* Seats */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${unbooked_seats < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Availability</p>
              <p className={`font-medium ${unbooked_seats < 5 ? 'text-red-600' : 'text-green-600'}`}>
                {unbooked_seats} seats left
              </p>
            </div>
          </div>

          {/* Footer / Action */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-lg font-bold text-blue-600">{route.price} ETB</p>
            </div>
            <BookButton 
              price={route.price}
              unbookedSeats={unbooked_seats}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        schedule={schedule} 
      />
    </>
  );
}
