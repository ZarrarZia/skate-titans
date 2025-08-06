
'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Gamepad2, ArrowUp, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const GameCanvas = dynamic(() => import('@/components/game/game-canvas').then((mod) => mod.GameCanvas), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export type GameState = 'menu' | 'playing' | 'gameOver' | 'characterSelect';
export type Character = 'boy' | 'girl' | 'cat';

const characters: Character[] = ['boy', 'girl', 'cat'];
const characterNames: { [key in Character]: string } = {
  boy: 'Futuro-Bot',
  girl: 'Cyra-Feline',
  cat: 'Mecha-Pounce',
};

export const JUMP_COOLDOWN_SECONDS = 120;

export default function PlayPage() {
  const [gameState, setGameState] = useState<GameState>('characterSelect');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('boy');
  const [jumpState, setJumpState] = useState({ count: 2, cooldown: 0 });
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };
  
  const restartGame = () => {
    setGameState('characterSelect');
    setScore(0);
  }

  const handleNextCharacter = () => {
    const currentIndex = characters.indexOf(selectedCharacter);
    const nextIndex = (currentIndex + 1) % characters.length;
    setSelectedCharacter(characters[nextIndex]);
  };

  const handlePrevCharacter = () => {
    const currentIndex = characters.indexOf(selectedCharacter);
    const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
    setSelectedCharacter(characters[prevIndex]);
  };


  return (
    <div className="relative h-screen w-full">
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <GameCanvas 
            gameState={gameState} 
            setGameState={setGameState} 
            setJumpState={setJumpState} 
            setScore={setScore} 
            selectedCharacter={selectedCharacter}
        />
      </Suspense>
      {gameState === 'characterSelect' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4 text-center text-white">
            <h1 className="text-6xl font-bold text-shadow">Select Your Character</h1>
            
            <div className="flex items-center gap-8">
              <Button onClick={handlePrevCharacter} size="icon" variant="outline" className="h-12 w-12 rounded-full">
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="w-64">
                <p className="text-4xl font-bold tracking-tighter text-primary">{characterNames[selectedCharacter]}</p>
              </div>
              <Button onClick={handleNextCharacter} size="icon" variant="outline" className="h-12 w-12 rounded-full">
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>

            <Button size="lg" onClick={startGame} className="mt-8 h-16 text-2xl animate-pulse">
              <Gamepad2 className="mr-4 h-8 w-8" />
              Start Game
            </Button>
          </div>
        </div>
      )}
       {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center gap-4 text-center text-white">
            <h1 className="text-7xl font-bold text-red-500 text-shadow">Game Over</h1>
            <p className="text-4xl font-bold">Score: {score}</p>
            <Button size="lg" onClick={restartGame} className="mt-4 h-16 text-2xl">
              Play Again
            </Button>
          </div>
        </div>
      )}
      {gameState === 'playing' && (
        <>
          <div className="absolute top-4 left-4 z-10 w-48 rounded-lg bg-black/50 p-4 text-white">
            <h3 className="font-bold">Jump Status</h3>
            <div className="flex items-center gap-2">
              <ArrowUp className="h-6 w-6" />
              <p className="text-2xl font-bold">{jumpState.count}</p>
            </div>
            {jumpState.cooldown > 0 && (
              <div className="mt-2">
                <p className="text-xs">Cooldown:</p>
                <Progress value={(1 - jumpState.cooldown / JUMP_COOLDOWN_SECONDS) * 100} className="h-2" />
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4 z-10 rounded-lg bg-black/50 p-4 text-white">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <p className="text-4xl font-bold">{score}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
