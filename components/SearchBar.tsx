'use client';

import { useState } from 'react';
import { Origami } from '@/lib/types';
import { getApiKey } from '@/lib/settings';

interface SearchBarProps {
  onResult: (origami: Origami | null) => void;
  onError: (error: string) => void;
}

export default function SearchBar({ onResult, onError }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      onError('Please enter a search term!');
      return;
    }

    setLoading(true);
    onError('');

    try {
      const apiKey = getApiKey();

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsApiKey) {
          onError(
            'Please add your OpenAI API key in Settings to use AI search! 🔑'
          );
        } else {
          onError(data.error || 'Search failed. Try again!');
        }
        onResult(null);
        setLoading(false);
        return;
      }

      if (data.success && data.origami) {
        // Save to localStorage so it can be accessed later
        const searchCache = JSON.parse(localStorage.getItem('origami_search_cache') || '{}');
        searchCache[data.origami.id] = data.origami;
        localStorage.setItem('origami_search_cache', JSON.stringify(searchCache));

        onResult(data.origami);
        setQuery('');
      } else {
        onError('No results found. Try a different search!');
        onResult(null);
      }

      setLoading(false);
    } catch (err) {
      onError('Search failed. Please check your connection!');
      onResult(null);
      setLoading(false);
    }
  };

  const quickSearches = [
    { emoji: '🐸', text: 'frog' },
    { emoji: '🦢', text: 'swan' },
    { emoji: '🌺', text: 'flower' },
    { emoji: '⛵', text: 'boat' },
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pr-24 text-xl"
          placeholder="Search for origami... (e.g., 'dragon', 'flower')"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-origami-purple to-origami-pink text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '🔍...' : '🔍 Search'}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 mr-2">Quick search:</span>
        {quickSearches.map((item) => (
          <button
            key={item.text}
            onClick={() => setQuery(item.text)}
            className="px-3 py-1 bg-white rounded-full text-sm font-semibold shadow hover:shadow-md transition border-2 border-purple-200 hover:border-purple-400"
          >
            {item.emoji} {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}
