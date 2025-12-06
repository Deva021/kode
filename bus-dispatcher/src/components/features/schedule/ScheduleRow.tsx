import React from 'react';
import { format } from 'date-fns';
import { ScheduleWithRoute } from '@/lib/api';
import BookButton from './BookButton';

interface ScheduleRowProps {
  schedule: ScheduleWithRoute;
  onBook: (schedule: ScheduleWithRoute) => void;
}

export default function ScheduleRow({ schedule, onBook }: ScheduleRowProps) {
  const { route, departure_time, bus_plate_number, total_seats, booked_seats } = schedule;
  const unbooked_seats = total_seats - booked_seats;

  return (
    <tr className={`hover:bg-blue-50 transition-colors`}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.destination}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{route.origin}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {new Date(departure_time).toLocaleString([], { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{bus_plate_number}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          unbooked_seats > 5 ? 'bg-green-100 text-green-800' : 
          unbooked_seats > 0 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {unbooked_seats} / {total_seats}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 font-medium text-green-600">
        {route.price} ETB
      </td>
      <td className="px-6 py-4">
        <BookButton 
          price={route.price} 
          unbookedSeats={unbooked_seats}
          onBook={() => onBook(schedule)} 
        />
      </td>
    </tr>
  );
}
