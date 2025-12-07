import React from 'react';
import { getAllSchedules } from '@/lib/api';
import ScheduleContainer from '@/components/features/schedule/ScheduleContainer';

export const revalidate = 30;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchedulePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  
  const destination = (resolvedParams.destination as string) || '';
  const date = (resolvedParams.date as string) || '';
  const page = parseInt((resolvedParams.page as string) || '1');
  const limit = 4;

  // Fetch data on the server based on URL params
  const { data, total } = await getAllSchedules(destination, date, page, limit);

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
