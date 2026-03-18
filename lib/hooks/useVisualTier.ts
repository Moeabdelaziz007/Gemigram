'use client';

import { useEffect, useMemo, useState } from 'react';

export type VisualTier = 'desktop' | 'mobile' | 'reduced';

export function useVisualTier() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setIsMobile(mobileQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    update();
    mobileQuery.addEventListener('change', update);
    reducedMotionQuery.addEventListener('change', update);

    return () => {
      mobileQuery.removeEventListener('change', update);
      reducedMotionQuery.removeEventListener('change', update);
    };
  }, []);

  return useMemo(() => {
    const tier: VisualTier = prefersReducedMotion ? 'reduced' : isMobile ? 'mobile' : 'desktop';

    return {
      tier,
      isMobile,
      prefersReducedMotion,
      allowMotion: !prefersReducedMotion,
      allowAmbientMotion: !prefersReducedMotion && !isMobile,
      allowHeavyEffects: !prefersReducedMotion && !isMobile,
    };
  }, [isMobile, prefersReducedMotion]);
}
