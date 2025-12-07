'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScheduleWithRoute } from '@/lib/api';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for schedules (initialized from server data, updated via realtime)
  const [schedules, setSchedules] = useState<ScheduleWithRoute[]>(initialData);
  
  // Reset local state when server data changes (URL/Filter change)
  useEffect(() => {
    setSchedules(initialData);
  }, [initialData]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleWithRoute | null>(null);

  const page = parseInt(searchParams.get('page') || '1');

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleBook = (schedule: ScheduleWithRoute) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <ScheduleFilters />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ScheduleTable 
          schedules={schedules} 
          loading={false} 
          onBook={handleBook}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(initialTotal / LIMIT)}
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
