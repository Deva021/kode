'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleWithRoute, getAllSchedules } from '@/lib/api';
import ScheduleFilters from './ScheduleFilters';
import ScheduleTable from './ScheduleTable';
import Pagination from '@/components/ui/Pagination';

interface ScheduleContainerProps {
  initialSchedules: ScheduleWithRoute[];
  initialTotal: number;
}

export default function ScheduleContainer({ initialSchedules, initialTotal }: ScheduleContainerProps) {
  const [schedules, setSchedules] = useState<ScheduleWithRoute[]>(initialSchedules);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 4;

  // Fetch data when filters or page change
  useEffect(() => {
    // Skip initial fetch since we have server data
    // Only fetch if filters or page have changed from initial state
    if (page === 1 && !destination && !departureDate && schedules === initialSchedules) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const { data, total } = await getAllSchedules(destination, departureDate, page, LIMIT);
      setSchedules(data);
      setTotal(total);
      setLoading(false);
    };

    fetchData();
  }, [destination, departureDate, page]);

  const handleFilterChange = (newDest: string, newDate: string) => {
    setDestination(newDest);
    setDepartureDate(newDate);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <ScheduleFilters onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          <ScheduleTable schedules={schedules} />
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      )}
    </div>
  );
}
