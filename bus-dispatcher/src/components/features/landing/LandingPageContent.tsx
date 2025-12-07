'use client';

import { useState } from 'react';
import SearchHero from '@/components/features/landing/SearchHero';
import ScheduleGrid from '@/components/features/landing/ScheduleGrid';

export default function LandingPageContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (destination: string) => {
    setSearchQuery(destination);
  };

  return (
    <div className="flex-1">
      <SearchHero onSearch={handleSearch} />
      <div className="container mx-auto px-6">
        <ScheduleGrid searchQuery={searchQuery} />
      </div>
    </div>
  );
}
