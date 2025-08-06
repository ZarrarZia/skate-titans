'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import * as Tone from 'tone/build/esm/index';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

const locationNotes: { [key: string]: string[] } = {
  '/': ['C4', 'E4', 'G4', 'C5'],
  '/characters': ['D4', 'F#4', 'A4', 'D5'],
  '/leaderboard': ['E4', 'G#4', 'B4', 'E5'],
  '/download': ['F4', 'A4', 'C5', 'F5'],
  '/login': ['A3', 'C4', 'E4', 'A4'],
  '/register': ['B3', 'D4', 'F#4', 'B4'],
};

export function AdaptiveAmbiance() {
  const pathname = usePathname();
  const [isMouseActive, setIsMouseActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const synth = useRef<Tone.PolySynth | null>(null);
  const sequence = useRef<Tone.Sequence | null>(null);

  const handleMouseMove = useCallback(() => {
    if (!isInitialized) return;
    setIsMouseActive(true);
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(() => setIsMouseActive(false), 2000);
  }, [isInitialized]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, [handleMouseMove]);
  
  const initializeAudio = async () => {
    if (isInitialized || typeof window === 'undefined') return;
    try {
      await Tone.start();
      
      synth.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fmsine' },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 },
      }).toDestination();
      synth.current.volume.value = -12;

      sequence.current = new Tone.Sequence((time, note) => {
        synth.current?.triggerAttackRelease(note, '16n', time);
      }, [], '8n').start(0);

      Tone.Transport.start();
      
      setIsInitialized(true);
    } catch(e) {
      console.error("Could not initialize audio", e)
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    
    Tone.Transport.bpm.rampTo(isMouseActive ? 160 : 100, 0.5);

    const notes = locationNotes[pathname] || locationNotes['/'];
    if (sequence.current) {
        sequence.current.events = notes;
    }

  }, [isMouseActive, pathname, isInitialized]);

  const toggleMute = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    Tone.Destination.mute = newMutedState;
  };
  
  useEffect(() => {
    Tone.Destination.mute = isMuted;
  }, [isMuted, isInitialized]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={toggleMute} variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-background/80">
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        <span className="sr-only">{isMuted ? 'Unmute ambiance' : 'Mute ambiance'}</span>
      </Button>
    </div>
  );
}
