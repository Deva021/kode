'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleWithRoute, getAllSchedules } from '@/lib/api';
import ScheduleFilters from './ScheduleFilters';
import ScheduleTable from './ScheduleTable';
import Pagination from '@/components/ui/Pagination';
import BookingModal from '../booking/BookingModal';

const LIMIT = 4;

interface ScheduleContainerProps {
  initialData: ScheduleWithRoute[];
  initialTotal: number;
}

export default function ScheduleContainer({ initialData, initialTotal }: ScheduleContainerProps) {
  const [schedules, setSchedules] = useState<ScheduleWithRoute[]>(initialData);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  
  // Filter State
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleWithRoute | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data, total } = await getAllSchedules(destination, date, page, LIMIT);
      setSchedules(data);
      setTotal(total);
    } catch (error) {
      console.error('Failed to fetch schedules', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [destination, date, page]);

  const handleFilterChange = (newDestination: string, newDate: string) => {
    setDestination(newDestination);
    setDate(newDate);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleBook = (schedule: ScheduleWithRoute) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <ScheduleFilters onFilterChange={handleFilterChange} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ScheduleTable 
          schedules={schedules} 
          loading={loading} 
          onBook={handleBook}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / LIMIT)}
        onPageChange={handlePageChange}
      />

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        schedule={selectedSchedule} 
      />
    </div>
  );
}
