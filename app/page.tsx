'use client';

import { useState, useEffect } from 'react';
import { Origami } from '@/lib/types';
import OrigamiGrid from '@/components/OrigamiGrid';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const [origamis, setOrigamis] = useState<Origami[]>([]);
  const [searchResult, setSearchResult] = useState<Origami | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    // Load static origami data
    fetch('/data/origami-starter.json')
      .then((res) => res.json())
      .then((data) => {
        setOrigamis(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading origami data:', err);
        setLoading(false);
      });
  }, []);

  const handleSearchResult = (result: Origami | null) => {
    setSearchResult(result);
    if (result) {
      // Add to the list if not already there
      setOrigamis((prev) => {
        const exists = prev.some((o) => o.id === result.id);
        if (!exists) {
          return [result, ...prev];
        }
        return prev;
      });
    }
  };

  const categories = [
    { id: 'all', label: 'All', emoji: '📄' },
    { id: 'animals', label: 'Animals', emoji: '🐶' },
    { id: 'toys', label: 'Toys', emoji: '✈️' },
    { id: 'flowers', label: 'Flowers', emoji: '🌸' },
    { id: 'decorations', label: 'Decorations', emoji: '⭐' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
  ];

  const filteredOrigamis = origamis.filter((origami) => {
    if (selectedCategory !== 'all' && origami.category !== selectedCategory) {
      return false;
    }
    if (selectedDifficulty !== 'all' && origami.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-bounce">📄</div>
        <p className="text-xl text-gray-600">Loading origami...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-origami-purple to-origami-pink bg-clip-text text-transparent mb-4">
          Discover Amazing Origami!
        </h2>
        <p className="text-xl text-gray-600">
          Fold, create, and have fun with paper! ✨
        </p>
      </div>

      {/* Search Section */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🔍 Search for New Origami
        </h3>
        <SearchBar onResult={handleSearchResult} onError={setError} />

        {error && (
          <div className="mt-4 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {searchResult && (
          <div className="mt-4 bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-xl">
            ✨ Found "{searchResult.name}"! Check it out below.
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-2">Category:</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-origami-purple to-origami-pink text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-2">Difficulty:</h4>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`px-4 py-2 rounded-full font-bold transition ${
                  selectedDifficulty === diff.id
                    ? 'bg-gradient-to-r from-origami-blue to-origami-green text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Origami Grid */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {filteredOrigamis.length} Origami Projects
        </h3>
        <OrigamiGrid
          origamis={filteredOrigamis}
          emptyMessage="No origami found with these filters. Try changing your selection!"
        />
      </div>
    </div>
  );
}
