import React from 'react';
import { getAllSchedules } from '@/lib/api';
import ScheduleContainer from '@/components/features/schedule/ScheduleContainer';

export const revalidate = 30;

export default async function SchedulePage() {
  // Fetch initial data on the server (Page 1, no filters)
  const { data, total } = await getAllSchedules('', '', 1, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Bus Schedules</h1>
        
        <ScheduleContainer 
          initialData={data} 
          initialTotal={total} 
        />
      </div>
    </div>
  );
}
