'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchDestinations } from '@/lib/api';

interface SearchHeroProps {
  onSearch: (destination: string) => void;
}

export default function SearchHero({ onSearch }: SearchHeroProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      const results = await searchDestinations(query);
      setSuggestions(results);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (destination?: string) => {
    const searchTerm = destination || query;
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (destination: string) => {
    setQuery(destination);
    handleSearch(destination);
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Find Your Next Journey
        </h1>
        <p className="text-blue-100 text-center mb-8 text-lg">
          Search for bus schedules to your destination
        </p>

        <div className="relative">
          <div className="flex gap-3 bg-white rounded-lg shadow-2xl p-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter destination (e.g., Bahir Dar, Gondar...)"
                className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none rounded-md"
              />

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((destination, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(destination)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 text-gray-700"
                    >
                      {destination}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleSearch()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
