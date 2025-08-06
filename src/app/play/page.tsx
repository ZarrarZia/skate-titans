'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const GameCanvas = dynamic(() => import('@/components/game/game-canvas').then((mod) => mod.GameCanvas), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function PlayPage() {
  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <GameCanvas />
      </Suspense>
    </div>
  );
}
