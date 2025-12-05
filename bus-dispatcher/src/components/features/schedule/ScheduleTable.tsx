'use client';

import React from 'react';
import { ScheduleWithRoute } from '@/lib/api';
import ScheduleRow from './ScheduleRow';

interface ScheduleTableProps {
  schedules: ScheduleWithRoute[];
}

export default function ScheduleTable({ schedules }: ScheduleTableProps) {
  const handleBook = (scheduleId: number) => {
    console.log('Book schedule:', scheduleId);
    alert(`Booking functionality will be implemented. Schedule ID: ${scheduleId}`);
  };

  if (schedules.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
        <p className="text-xl text-gray-500">No schedules found.</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Destination</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Origin</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Departure Time</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Bus Plate</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Available Seats</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, idx) => (
              <ScheduleRow
                key={schedule.id}
                schedule={schedule}
                onBook={handleBook}
                isEven={idx % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
