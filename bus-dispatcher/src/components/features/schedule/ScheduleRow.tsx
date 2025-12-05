import React from 'react';
import { format } from 'date-fns';
import { ScheduleWithRoute } from '@/lib/api';
import BookButton from './BookButton';

interface ScheduleRowProps {
  schedule: ScheduleWithRoute;
  onBook: (scheduleId: number) => void;
  isEven: boolean;
}

export default function ScheduleRow({ schedule, onBook, isEven }: ScheduleRowProps) {
  const { route, departure_time, bus_plate_number, unbooked_seats, total_seats } = schedule;

  return (
    <tr className={`${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.destination}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{route.origin}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {format(new Date(departure_time), 'PPP p')}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{bus_plate_number}</td>
      <td className="px-6 py-4 text-sm">
        <span className={`font-semibold ${unbooked_seats < 5 ? 'text-red-600' : 'text-green-600'}`}>
          {unbooked_seats} / {total_seats}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-bold text-green-600">{route.price} ETB</td>
      <td className="px-6 py-4">
        <BookButton
          scheduleId={schedule.id}
          unbookedSeats={unbooked_seats}
          onBook={onBook}
        />
      </td>
    </tr>
  );
}
