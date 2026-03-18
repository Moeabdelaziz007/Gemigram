import { Cpu, Lock, Terminal, BarChart, Layers } from 'lucide-react';
import { BRAND } from '@/lib/constants/branding';

export function BentoFeatures() {
  const features = [
    {
      title: `${BRAND.product.name} Core`,
      description: 'Ultra-secure L1 synapse processing for industrial applications.',
      icon: Cpu,
      className: 'md:col-span-2 md:row-span-2',
    },
    {
      title: `${BRAND.product.name} Lock`,
      description: 'Quantum-safe cryptographic identity management.',
      icon: Lock,
      className: 'md:col-span-1 md:row-span-1 border-gemigram-neon/20',
    },
    {
      title: `${BRAND.product.name} CLI`,
      description: 'Advanced command execution with sub-ms feedback.',
      icon: Terminal,
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: `${BRAND.product.name} Logic`,
      description: 'Deterministic AI logic gates for complex workflows.',
      icon: BarChart,
      className: 'md:col-span-1 md:row-span-2 border-gemigram-neon/10',
    },
    {
      title: `${BRAND.product.name} Spine`,
      description: 'Zero-latency Bi-Directional PCM streaming for sub-millisecond AI response.',
      icon: Layers,
      className: 'md:col-span-2 md:row-span-1',
    },
  ];

  return (
    <section id="features" className="py-32 bg-carbon-black relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">
            The <span className="text-gemigram-neon">{BRAND.product.name}</span> Spine
          </h2>
          <p className="text-white/30 max-w-2xl mx-auto text-lg font-medium">
            Next-generation infrastructure architected for neural sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className={`sovereign-glass p-8 md:p-12 flex flex-col justify-between group hover:border-gemigram-neon/40 transition-all duration-700 ${feature.className}`}>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-10 group-hover:bg-gemigram-neon group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(57,255,20,0)] group-hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter group-hover:text-gemigram-neon transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-white/40 leading-relaxed font-bold uppercase text-xs tracking-widest group-hover:text-white/60 transition-colors">
                  {feature.description}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/5 group-hover:text-gemigram-neon/40 transition-colors">
                <span>Access_Status::Enabled</span>
                <div className="h-px flex-1 bg-white/5 group-hover:bg-gemigram-neon/10 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
