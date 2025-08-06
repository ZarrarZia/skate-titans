'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

const GameCanvas = dynamic(() => import('@/components/game/game-canvas').then((mod) => mod.GameCanvas), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export type GameState = 'menu' | 'playing' | 'gameOver';

export default function PlayPage() {
  const [gameState, setGameState] = useState<GameState>('menu');

  const startGame = () => {
    setGameState('playing');
  };
  
  const restartGame = () => {
    setGameState('menu');
     setTimeout(() => {
      setGameState('playing');
    }, 100);
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <GameCanvas gameState={gameState} setGameState={setGameState} />
      </Suspense>
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4 text-center text-white">
            <h1 className="text-6xl font-bold text-shadow">Skate Titans</h1>
            <p className="text-xl">Avoid the oncoming traffic to survive!</p>
            <Button size="lg" onClick={startGame} className="mt-4 h-16 text-2xl animate-pulse">
              <Gamepad2 className="mr-4 h-8 w-8" />
              Start Playing
            </Button>
          </div>
        </div>
      )}
       {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center gap-4 text-center text-white">
            <h1 className="text-7xl font-bold text-red-500 text-shadow">Game Over</h1>
            <Button size="lg" onClick={restartGame} className="mt-4 h-16 text-2xl">
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
