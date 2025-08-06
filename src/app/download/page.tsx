import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, HardDrive, Monitor, MousePointerClick } from 'lucide-react';

const steps = [
  {
    icon: <MousePointerClick className="h-8 w-8 text-primary" />,
    title: 'Download the Installer',
    description: 'Click the big shiny button above to download the `SkateTitans_setup.exe` file.',
  },
  {
    icon: <HardDrive className="h-8 w-8 text-primary" />,
    title: 'Run the Installer',
    description: 'Find the downloaded file in your Downloads folder and double-click it to start the installation process.',
  },
  {
    icon: <Monitor className="h-8 w-8 text-primary" />,
    title: 'Launch the Game',
    description: 'Once installed, find the Skate Titans icon on your desktop and double-click to start playing!',
  },
];

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-shadow md:text-6xl">Download Skate Titans</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Get the latest version of the game and start your adventure. Free to play on Windows PC.
        </p>
      </div>

      <div className="my-12 flex justify-center">
        <Button size="lg" className="h-16 group animate-pulse text-2xl" asChild>
          <a href="/game-downloads/skate-titans-v1.0.exe" download>
            <Download className="mr-4 h-8 w-8 transition-transform group-hover:scale-110" />
            Download Now (v1.0)
          </a>
        </Button>
      </div>

      <Card className="w-full max-w-4xl mx-auto border-primary/20 bg-card/80">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Installation Guide</CardTitle>
          <CardDescription className="text-center">
            Follow these simple steps to get the game running on your PC.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
