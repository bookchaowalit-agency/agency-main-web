import type { ReactNode } from 'react';
import { PublicHeader } from '@/components/public-header';

export default function AgenciesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="site-shell">
      <PublicHeader />
      {children}
    </div>
  );
}
