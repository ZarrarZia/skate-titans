'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { TrailerModal } from '@/components/trailer-modal';
import { ArrowRight, Download, PlayCircle, ShieldCheck, Swords, Trophy, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <Swords className="h-10 w-10 text-primary" />,
    title: 'Endless Running',
    description: 'Dash and dodge through an ever-changing urban landscape. How far can you go?',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Epic Power-ups',
    description: 'Grab magnets, jetpacks, and more to boost your score and outrun the guards.',
  },
  {
    icon: <Trophy className="h-10 w-10 text-primary" />,
    title: 'Global Leaderboard',
    description: 'Compete against players worldwide for the ultimate high score and bragging rights.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Unlockable Characters',
    description: 'Collect coins to unlock unique characters and cool skins to show off your style.',
  },
];

const screenshots = [
  { src: 'https://placehold.co/1600x900/be29ec/ebe2f5.png', alt: 'Gameplay screenshot 1', hint: "gameplay action" },
  { src: 'https://placehold.co/1600x900/2996ec/ebe2f5.png', alt: 'Gameplay screenshot 2', hint: "character customization" },
  { src: 'https://placehold.co/1600x900/ebe2f5/2996ec.png', alt: 'Gameplay screenshot 3', hint: "city landscape" },
  { src: 'https://placehold.co/1600x900/1d1128/be29ec.png', alt: 'Gameplay screenshot 4', hint: "power up" },
];

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative flex h-[80vh] min-h-[600px] w-full items-center justify-center text-center">
        <div className="container z-10 mx-auto px-4 md:px-6">
          <h1 className="text-6xl font-bold tracking-tighter text-shadow sm:text-7xl md:text-8xl lg:text-9xl">
            Skate Titans
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-lg text-foreground/80 md:text-xl">
            Join the crew, dodge the guards, and become a legend of the subway. The ultimate endless runner experience awaits.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrailerModal>
              <Button size="lg" className="group text-lg">
                <PlayCircle className="mr-2 h-6 w-6 transition-transform group-hover:scale-110" />
                Watch Trailer
              </Button>
            </TrailerModal>
            <Link href="/download">
              <Button size="lg" variant="secondary" className="group text-lg">
                <Download className="mr-2 h-6 w-6 transition-transform group-hover:scale-110" />
                Download for PC
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-4xl font-bold tracking-tighter md:text-5xl">Game Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="transform-gpu border-primary/20 bg-card/80 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30">
                <CardHeader>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4 text-2xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-4xl font-bold tracking-tighter md:text-5xl">Gameplay Preview</h2>
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {screenshots.map((shot, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden border-primary/20 bg-card/80">
                    <CardContent className="p-0">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={1600}
                        height={900}
                        className="aspect-video w-full object-cover"
                        data-ai-hint={shot.hint}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-16" />
            <CarouselNext className="mr-16" />
          </Carousel>
        </div>
      </section>
      
      <section id="cta" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-center shadow-lg md:p-12">
                <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Ready to become a Titan?</h2>
                <p className="mt-4 text-lg text-primary-foreground/80">Download Skate Titans now and start your adventure!</p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link href="/download">
                    <Button size="lg" variant="secondary" className="group bg-white text-primary hover:bg-white/90">
                      Download Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
