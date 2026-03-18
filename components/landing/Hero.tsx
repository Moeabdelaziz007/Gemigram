import Link from 'next/link';
import { ArrowRight, Fingerprint, Globe, Mic, Shield, Zap } from 'lucide-react';
import { BRAND } from '@/lib/constants/branding';
import { LandingPrimaryAction } from './LandingPrimaryAction';

const metrics = [
  { icon: Shield, label: 'Carbon Secure', value: 'AES-256' },
  { icon: Zap, label: 'Realtime Voice', value: 'Sub-second' },
  { icon: Globe, label: 'Sovereign Links', value: 'MCP + API' },
  { icon: Fingerprint, label: 'Identity Layer', value: 'Voice-first' },
];

export function EnterpriseHero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden bg-carbon-black">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen" style={{ backgroundImage: "url('/hero_bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-gradient-to-br from-gemigram-neon/20 to-gemigram-neon/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-gradient-to-tl from-gemigram-neon/10 to-transparent rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <div className="w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[360px] lg:h-[360px] rounded-full relative mb-16 bg-[radial-gradient(circle,var(--gemigram-neon-glow)_0%,rgba(57,255,20,0.12)_40%,transparent_70%)] blur-[6px]" />

        <div className="max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-gemigram-neon/20 bg-gemigram-neon/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-gemigram-neon">
            <Mic className="h-3.5 w-3.5" />
            Voice-native orchestration layer
          </div>

          <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-[-0.06em] uppercase leading-[0.92]">
            Build sovereign AI workspaces with <span className="text-gemigram-neon">{BRAND.product.name}</span>.
          </h1>

          <p className="mx-auto max-w-3xl text-base md:text-xl text-white/60 leading-relaxed">
            Keep the landing page cinematic, but let the platform stay mostly server-rendered until the user actually needs auth, voice, or navigation controls.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LandingPrimaryAction className="px-8 py-4 rounded-full bg-gemigram-neon text-black font-black uppercase tracking-[0.25em] shadow-[0_0_40px_rgba(57,255,20,0.35)] transition hover:scale-[1.01]">
              Initialize Voice Login
            </LandingPrimaryAction>
            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/10 bg-white/5 text-white/80 uppercase tracking-[0.25em] text-xs font-black hover:border-gemigram-neon/30 hover:text-white transition">
              Explore Architecture
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mt-20 md:mt-28 max-w-6xl mx-auto border-t border-white/[0.03] pt-12 md:pt-16 w-full">
          {metrics.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 cursor-default">
              <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <item.icon className="w-5 h-5 text-gemigram-neon opacity-80" />
              </div>
              <span className="text-sm font-bold text-white uppercase">{item.value}</span>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
