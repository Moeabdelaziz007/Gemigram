'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/Providers';
import { AuthStoreBridge } from './AuthStoreBridge';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthStoreBridge />
      {children}
    </AuthProvider>
  );
}
