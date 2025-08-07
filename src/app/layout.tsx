
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skate Titans - The Ultimate Endless Runner',
  description: 'Dodge cars and become a legend in this endless runner adventure!',
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
