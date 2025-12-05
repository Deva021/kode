'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { searchDestinations } from '@/lib/api';

interface ScheduleFiltersProps {
  onFilterChange: (destination: string, date: string) => void;
}

export default function ScheduleFilters({ onFilterChange }: ScheduleFiltersProps) {
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange(destination, departureDate);
  }, [destination, departureDate, onFilterChange]);

  const handleSelectSuggestion = (dest: string) => {
    setDestination(dest);
    setShowSuggestions(false);
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
            onChange={(e) => {
              setDestination(e.target.value);
              setShowSuggestions(true);
            }}
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
            onChange={(e) => setDepartureDate(e.target.value)}
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
          }}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
