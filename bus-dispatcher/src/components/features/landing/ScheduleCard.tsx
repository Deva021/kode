import React from 'react';
import { Calendar, MapPin, DollarSign, Bus, AlertCircle } from 'lucide-react';
import { ScheduleWithRoute } from '@/lib/api';
import { PrimaryButton } from '@/components/ui/buttons';
import { format } from 'date-fns';

interface ScheduleCardProps {
  schedule: ScheduleWithRoute;
  onBook: (scheduleId: number) => void;
}

export default function ScheduleCard({ schedule, onBook }: ScheduleCardProps) {
  const { route, departure_time, bus_plate_number, unbooked_seats } = schedule;
  const isLowSeats = unbooked_seats < 5;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
      {/* Destination Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={24} className="text-blue-600" />
            {route.destination}
          </h3>
          <p className="text-sm text-gray-500 mt-1">From: {route.origin}</p>
        </div>
        {isLowSeats && (
          <div className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            <AlertCircle size={16} />
            Only {unbooked_seats} left!
          </div>
        )}
      </div>

      {/* Schedule Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar size={18} className="text-gray-400" />
          <span className="font-medium">
            {format(new Date(departure_time), 'PPP p')}
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Bus size={18} className="text-gray-400" />
          <span>Bus: {bus_plate_number}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <DollarSign size={18} className="text-gray-400" />
          <span className="text-xl font-bold text-green-600">
            {route.price} ETB
          </span>
        </div>
      </div>

      {/* Book Button */}
      <PrimaryButton
        onClick={() => onBook(schedule.id)}
        className={`w-full ${isLowSeats ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-green-600 hover:bg-green-700 shadow-green-500/30'} border-none text-white shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        Book Now
      </PrimaryButton>
    </div>
  );
}
