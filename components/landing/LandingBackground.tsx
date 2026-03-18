'use client';

import dynamic from 'next/dynamic';

const HeroBackground = dynamic(() => import('@/components/HeroBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050505]" aria-hidden="true" />,
});

export function LandingBackground() {
  return <HeroBackground />;
}
