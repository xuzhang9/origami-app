'use client';

import { useState, useEffect } from 'react';
import { Origami } from '@/lib/types';
import OrigamiGrid from '@/components/OrigamiGrid';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Origami[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Get favorite IDs from localStorage
        const favoriteIds = JSON.parse(localStorage.getItem('origami_favorites') || '[]');

        if (favoriteIds.length === 0) {
          setLoading(false);
          return;
        }

        // Load all origami data
        const response = await fetch('/data/origami-starter.json');
        const allOrigami = await response.json();

        // Filter to only favorites
        const favoriteOrigamis = allOrigami.filter((o: Origami) =>
          favoriteIds.includes(o.id)
        );

        // Add favorite flag
        const withFlags = favoriteOrigamis.map((o: Origami) => ({
          ...o,
          isFavorite: true,
        }));

        setFavorites(withFlags);
        setLoading(false);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-bounce">📄</div>
        <p className="text-xl text-gray-600">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-origami-pink to-origami-purple bg-clip-text text-transparent mb-4">
          💖 My Favorite Origami
        </h1>
        <p className="text-xl text-gray-600">
          Your collection of favorite folds!
        </p>
      </div>

      {/* Favorites grid */}
      {favorites.length === 0 ? (
        <div className="card text-center py-20">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No favorites yet!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Click the heart icon on any origami to add it to your favorites.
          </p>
          <a href="/" className="btn-primary inline-block">
            🏠 Browse Origami
          </a>
        </div>
      ) : (
        <OrigamiGrid origamis={favorites} />
      )}
    </div>
  );
}
