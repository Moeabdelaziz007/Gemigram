'use client';

import type { ReactNode } from 'react';
import { useLandingInteractive } from './LandingInteractiveProvider';

export function LandingPrimaryAction({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { openAuth } = useLandingInteractive();

  return (
    <button onClick={openAuth} className={className}>
      {children ?? <span>{label}</span>}
    </button>
  );
}
