
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skate Titans: Free Endless Runner Robot Game for Kids - Play Now!',
  description: 'Jump into Skate Titans, the action-packed free endless runner game for kids! Dodge cars, collect points, and become a legend in this fun robot adventure. Play for free online!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: "url('/a0134446-e522-452a-ac53-06696669f697.jpeg')" }}
          data-ai-hint="robot running highway"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
