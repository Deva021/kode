'use client';

import React, { useEffect, useState } from 'react';
import { ScheduleWithRoute, getGroupedSchedules } from '@/lib/api';
import ScheduleCard from './ScheduleCard';

interface ScheduleGridProps {
  searchQuery: string;
}

export default function ScheduleGrid({ searchQuery }: ScheduleGridProps) {
  const [schedules, setSchedules] = useState<ScheduleWithRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      const data = await getGroupedSchedules(searchQuery);
      setSchedules(data);
      setLoading(false);
    };

    fetchSchedules();
  }, [searchQuery]);

  const handleBook = (scheduleId: number) => {
    console.log('Book schedule:', scheduleId);
    alert(`Booking functionality will be implemented. Schedule ID: ${scheduleId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">
          No schedules found{searchQuery ? ` for "${searchQuery}"` : ''}.
        </p>
        <p className="text-gray-400 mt-2">Try searching for a different destination.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {schedules.map((schedule) => (
        <ScheduleCard key={schedule.id} schedule={schedule} onBook={handleBook} />
      ))}
    </div>
  );
}
