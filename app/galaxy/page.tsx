'use client';

import dynamic from 'next/dynamic';

const GalaxyScene = dynamic(() => import('@/components/galaxy/GalaxyScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[70vh] items-center justify-center bg-[#040404] p-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-gemigram-neon/10 bg-black/40 p-8 glass-subtle">
        <div className="mb-4 h-4 w-40 rounded-full bg-gemigram-neon/10" />
        <div className="mb-10 h-3 w-64 rounded-full bg-white/5" />
        <div className="mx-auto h-48 w-48 rounded-full border border-dashed border-gemigram-neon/20 bg-[radial-gradient(circle_at_center,rgba(16,255,135,0.08),transparent_70%)]" />
      </div>
    </div>
  ),
});

export default function GalaxyPage() {
  return <GalaxyScene />;
}
