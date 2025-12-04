'use client';

import { useState } from 'react';
import SearchHero from '@/components/features/landing/SearchHero';
import ScheduleGrid from '@/components/features/landing/ScheduleGrid';
import Sidebar from '@/components/layout/Sidebar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (destination: string) => {
    setSearchQuery(destination);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        <SearchHero onSearch={handleSearch} />
        <div className="container mx-auto px-6">
          <ScheduleGrid searchQuery={searchQuery} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-80">
        <Sidebar />
      </div>
    </div>
  );
}
