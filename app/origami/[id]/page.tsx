'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Origami } from '@/lib/types';
import StepViewer from '@/components/StepViewer';

export default function OrigamiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [origami, setOrigami] = useState<Origami | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadOrigami = async () => {
      try {
        // Load from static data first
        const response = await fetch('/data/origami-starter.json');
        const data = await response.json();
        let found = data.find((o: Origami) => o.id === params.id);

        // If not found in static data, check localStorage for AI search results
        if (!found) {
          const searchCache = JSON.parse(localStorage.getItem('origami_search_cache') || '{}');
          found = searchCache[params.id as string];
        }

        if (found) {
          setOrigami(found);

          // Load favorite and completed status from localStorage
          const favorites = JSON.parse(localStorage.getItem('origami_favorites') || '[]');
          const completed = JSON.parse(localStorage.getItem('origami_completed') || '[]');

          setIsFavorite(favorites.includes(found.id));
          setIsCompleted(completed.includes(found.id));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading origami:', error);
        setLoading(false);
      }
    };

    loadOrigami();
  }, [params.id]);

  const toggleFavorite = () => {
    if (!origami) return;

    const favorites = JSON.parse(localStorage.getItem('origami_favorites') || '[]');
    let updated;

    if (isFavorite) {
      updated = favorites.filter((id: string) => id !== origami.id);
    } else {
      updated = [...favorites, origami.id];
    }

    localStorage.setItem('origami_favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const toggleCompleted = () => {
    if (!origami) return;

    const completed = JSON.parse(localStorage.getItem('origami_completed') || '[]');
    let updated;

    if (isCompleted) {
      updated = completed.filter((id: string) => id !== origami.id);
    } else {
      updated = [...completed, origami.id];
    }

    localStorage.setItem('origami_completed', JSON.stringify(updated));
    setIsCompleted(!isCompleted);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-bounce">📄</div>
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!origami) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Origami Not Found</h2>
        <button
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          🏠 Go Back Home
        </button>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    hard: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-origami-purple to-origami-pink bg-clip-text text-transparent mb-3">
            {origami.name}
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                difficultyColors[origami.difficulty]
              }`}
            >
              {origami.difficulty.charAt(0).toUpperCase() + origami.difficulty.slice(1)}
            </span>

            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-bold border-2 border-purple-300">
              {origami.category}
            </span>

            <span className="text-gray-600">
              {origami.steps.length} steps
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-full ${
              isFavorite ? 'bg-pink-500' : 'bg-gray-200'
            } hover:scale-110 transition text-2xl`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '💖' : '🤍'}
          </button>

          <button
            onClick={toggleCompleted}
            className={`p-3 rounded-full ${
              isCompleted ? 'bg-green-500' : 'bg-gray-200'
            } hover:scale-110 transition text-2xl`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          >
            {isCompleted ? '✅' : '⬜'}
          </button>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="btn-secondary"
      >
        ⬅️ Back to Home
      </button>

      {/* Step viewer */}
      <StepViewer steps={origami.steps} origamiName={origami.name} />

      {/* Source link */}
      {origami.sourceUrl && (
        <div className="text-center">
          <a
            href={origami.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-bold rounded-full hover:bg-purple-50 transition"
          >
            🔗 View Original Source
          </a>
        </div>
      )}
    </div>
  );
}
