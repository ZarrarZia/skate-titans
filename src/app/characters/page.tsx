import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';

const characters = [
  { name: 'Jake', image: 'https://placehold.co/600x800/be29ec/ffffff.png', hint: 'male character running', description: 'The original subway surfer, always ready for an adventure.' },
  { name: 'Tricky', image: 'https://placehold.co/600x800/2996ec/ffffff.png', hint: 'female character cool pose', description: 'The brainy one of the crew, loves to dance.' },
  { name: 'Fresh', image: 'https://placehold.co/600x800/34d399/ffffff.png', hint: 'male character with boombox', description: 'The music lover with a boombox, always has a fresh beat.' },
  { name: 'Spike', image: 'https://placehold.co/600x800/f59e0b/ffffff.png', hint: 'punk character mohawk', description: 'The punk rocker with a rebellious attitude.' },
  { name: 'Yutani', image: 'https://placehold.co/600x800/ec4899/ffffff.png', hint: 'alien character green skin', description: 'The quirky alien with a love for science and tech.' },
  { name: 'Lucy', image: 'https://placehold.co/600x800/ef4444/ffffff.png', hint: 'female character goth style', description: 'The tough girl with a punk-goth style.' },
  { name: 'Tagbot', image: 'https://placehold.co/600x800/6b7280/ffffff.png', hint: 'robot character graffiti', description: 'A friendly robot designed for graffiti art.' },
  { name: 'Ninja', image: 'https://placehold.co/600x800/1f2937/ffffff.png', hint: 'ninja character dark suit', description: 'A swift and silent ninja, master of the shadows.' },
];

export default function CharactersPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-shadow md:text-6xl">Characters & Skins</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Meet the crew! Each character has a unique style. Collect them all and find your favorite.
        </p>
      </div>

      <div className="mt-12">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {characters.map((character, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <Card className="transform-gpu overflow-hidden border-primary/20 bg-card/80 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30">
                    <CardContent className="p-0">
                      <Image
                        src={character.image}
                        alt={character.name}
                        width={600}
                        height={800}
                        className="h-auto w-full object-cover"
                        data-ai-hint={character.hint}
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle className="text-center text-2xl">{character.name}</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <p className="text-center text-muted-foreground">{character.description}</p>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-16" />
          <CarouselNext className="mr-16" />
        </Carousel>
      </div>
    </div>
  );
}
