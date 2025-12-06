'use client';

import React from 'react';
import { ScheduleWithRoute } from '@/lib/api';
import ScheduleRow from './ScheduleRow';
import { useRouter } from 'next/navigation';

interface ScheduleTableProps {
  schedules: ScheduleWithRoute[];
  loading?: boolean;
  onBook: (schedule: ScheduleWithRoute) => void;
}

export default function ScheduleTable({ schedules, loading, onBook }: ScheduleTableProps) {
  const router = useRouter();

  const handleBook = (schedule: ScheduleWithRoute) => {
    onBook(schedule);
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
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Plate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, idx) => (
              <ScheduleRow
                key={schedule.id}
                schedule={schedule}
                onBook={handleBook}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
