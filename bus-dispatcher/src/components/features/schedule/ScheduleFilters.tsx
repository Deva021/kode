'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import { searchDestinations } from '@/lib/api';

export default function ScheduleFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [departureDate, setDepartureDate] = useState(searchParams.get('date') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setDestination(searchParams.get('destination') || '');
    setDepartureDate(searchParams.get('date') || '');
  }, [searchParams]);

  // Fetch destination suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (destination.trim() === '') {
        setSuggestions([]);
        return;
      }

      const results = await searchDestinations(destination);
      setSuggestions(results);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [destination]);

  const updateFilters = (newDestination: string, newDate: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newDestination) {
      params.set('destination', newDestination);
    } else {
      params.delete('destination');
    }

    if (newDate) {
      params.set('date', newDate);
    } else {
      params.delete('date');
    }

    // Reset to page 1 on filter change
    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    setShowSuggestions(true);
    // Debounce URL update for typing? Or just update on blur/enter?
    // For now, let's update on blur or selection to avoid too many pushes, 
    // but the previous implementation updated on change.
    // To keep it responsive, maybe we wait for selection or explicit action?
    // The previous one had a debounce on fetchSuggestions, but onFilterChange was called in useEffect [destination].
    // So it was updating parent state on every keystroke.
    // Updating URL on every keystroke is bad UX (history spam).
    // Let's update URL only when a suggestion is selected or on blur/enter.
    // But the user might just type "Bahir Dar" and not select.
    // Let's add a "Search" button or update on debounce?
    // The original code updated parent immediately.
    // Let's use a debounce for the URL update.
  };

  // Debounced URL update for destination
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destination !== (searchParams.get('destination') || '')) {
        updateFilters(destination, departureDate);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [destination]);

  // Immediate update for date
  const handleDateChange = (value: string) => {
    setDepartureDate(value);
    updateFilters(destination, value);
  };

  const handleSelectSuggestion = (dest: string) => {
    setDestination(dest);
    setShowSuggestions(false);
    updateFilters(dest, departureDate);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter Schedules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination Filter */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter destination..."
            className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
              {suggestions.map((dest, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(dest)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 text-gray-700"
                >
                  {dest}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Departure Date
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full text-gray-400 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {(destination || departureDate) && (
        <button
          onClick={() => {
            setDestination('');
            setDepartureDate('');
            setShowSuggestions(false);
            updateFilters('', '');
          }}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
