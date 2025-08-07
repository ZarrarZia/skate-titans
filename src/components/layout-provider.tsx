
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // This component is no longer used in the new simplified layout.
  // It can be removed in a future cleanup.
  // We will render children directly.
  return <>{children}</>;
}
