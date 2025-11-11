'use client';

import Link from 'next/link';
import { Origami } from '@/lib/types';

interface OrigamiCardProps {
  origami: Origami;
}

export default function OrigamiCard({ origami }: OrigamiCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    hard: 'bg-red-100 text-red-800 border-red-300',
  };

  const categoryEmojis = {
    animals: '🐶',
    toys: '✈️',
    flowers: '🌸',
    decorations: '⭐',
    other: '📄',
  };

  return (
    <Link href={`/origami/${origami.id}`}>
      <div className="card group cursor-pointer hover:scale-105 transition-all duration-200">
        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          {origami.thumbnailUrl ? (
            <img
              src={origami.thumbnailUrl}
              alt={origami.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">
              {categoryEmojis[origami.category] || '📄'}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-origami-purple transition">
          {origami.name}
        </h3>

        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${
              difficultyColors[origami.difficulty]
            }`}
          >
            {origami.difficulty.charAt(0).toUpperCase() + origami.difficulty.slice(1)}
          </span>

          <span className="text-gray-500 text-sm">
            {origami.steps.length} steps
          </span>
        </div>

        {origami.isFavorite && (
          <div className="mt-2 text-center">
            <span className="text-2xl">💖</span>
          </div>
        )}

        {origami.isCompleted && (
          <div className="mt-2 text-center">
            <span className="text-2xl">✅</span>
          </div>
        )}
      </div>
    </Link>
  );
}
