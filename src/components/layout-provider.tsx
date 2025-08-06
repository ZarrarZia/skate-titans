'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGamePage = pathname === '/play';

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isGamePage && <Header />}
      <main className="flex-1">{children}</main>
      {!isGamePage && <Footer />}
    </div>
  );
}
