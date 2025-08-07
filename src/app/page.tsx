
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Gamepad2 } from 'lucide-react';

export default function HomePage() {
  const [step, setStep] = useState<'splash' | 'username'>('splash');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleStart = () => {
    setStep('username');
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError('');
  };

  const handlePlayGame = () => {
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    router.push(`/play?username=${encodeURIComponent(username.trim())}`);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePlayGame();
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center text-center">
      <div className="container z-10 mx-auto flex items-center justify-center px-4 md:px-6">
        {step === 'splash' && (
          <div className="flex flex-col items-center">
            <Bot className="h-24 w-24 text-primary animate-bounce" />
            <h1 className="mt-8 text-6xl font-bold tracking-tighter text-shadow sm:text-7xl md:text-8xl">
              Skate Titans
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-foreground/80 md:text-xl">
              Dodge the cars, collect points, and become a legend of the subway.
            </p>
            <Button size="lg" className="group mt-8 text-2xl" onClick={handleStart}>
              <Gamepad2 className="mr-2 h-6 w-6 transition-transform group-hover:scale-110" />
              Start Game
            </Button>
          </div>
        )}

        {step === 'username' && (
           <Card className="w-full max-w-sm border-primary/20 bg-card/80">
            <CardHeader>
              <CardTitle className="text-2xl">Enter your name to begin</CardTitle>
              <CardDescription>Your name will be displayed on the Game Over screen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <Label htmlFor="username" className="sr-only">Username</Label>
               <Input 
                 id="username" 
                 placeholder="Enter your name..." 
                 value={username} 
                 onChange={handleUsernameChange}
                 onKeyDown={handleKeyDown}
                 autoFocus
               />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePlayGame}>
                Play
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
