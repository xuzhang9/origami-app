'use client';

import { Origami } from '@/lib/types';
import OrigamiCard from './OrigamiCard';

interface OrigamiGridProps {
  origamis: Origami[];
  emptyMessage?: string;
}

export default function OrigamiGrid({ origamis, emptyMessage }: OrigamiGridProps) {
  if (origamis.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-xl text-gray-600">
          {emptyMessage || 'No origami found. Try searching!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {origamis.map((origami) => (
        <OrigamiCard key={origami.id} origami={origami} />
      ))}
    </div>
  );
}
