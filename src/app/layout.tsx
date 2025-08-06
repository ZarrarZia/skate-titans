import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdaptiveAmbiance } from '@/components/adaptive-ambiance';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skate Titans - The Ultimate Endless Runner',
  description: 'Download Skate Titans and join the endless running adventure!',
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
          style={{ backgroundImage: "url('https://placehold.co/1920x1080/0d0712/1d1128.png')" }}
          data-ai-hint="graffiti subway wall"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <AdaptiveAmbiance />
      </body>
    </html>
  );
}
