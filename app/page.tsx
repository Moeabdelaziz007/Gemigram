import { EnterpriseHeader } from '@/components/landing/Header';
import { EnterpriseHero } from '@/components/landing/Hero';
import { BentoFeatures } from '@/components/landing/BentoFeatures';
import { EnterpriseFooter } from '@/components/landing/Footer';
import { LandingInteractiveProvider } from '@/components/landing/LandingInteractiveProvider';
import { LandingPrimaryAction } from '@/components/landing/LandingPrimaryAction';
import { IntegrationsShowcase } from '@/components/landing/IntegrationsShowcase';
import { LandingBackground } from '@/components/landing/LandingBackground';

export default function LandingPage() {
  return (
    <LandingInteractiveProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-gemigram-neon/20">
        <LandingBackground />
        <EnterpriseHeader />

        <main className="relative z-10">
          <EnterpriseHero />

          <section className="py-24 border-y border-gemigram-neon/10 bg-black/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none carbon-fiber" />
            <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['ORACLE.NODE', 'NEXUS.SPINE', 'LATTICE.NEON', 'VERTEX.CARBON'].map((label) => (
                <div key={label} className="text-2xl font-black tracking-[0.6em] text-white uppercase italic hover:text-gemigram-neon transition-colors cursor-default">
                  {label}
                </div>
              ))}
            </div>
          </section>

          <BentoFeatures />
          <IntegrationsShowcase />

          <section className="py-40 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] pointer-events-none" />
            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-5xl mx-auto glass-strong p-20 text-center relative overflow-hidden group rounded-[3rem] border-gemigram-neon/20 hover:border-gemigram-neon/40 transition-colors duration-500">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none carbon-fiber" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gemigram-neon/5 blur-[120px] rounded-full group-hover:bg-gemigram-neon/10 transition-all duration-1000 pointer-events-none" />

                <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter uppercase relative z-10 leading-none">
                  Ready for <span className="text-gemigram-neon drop-shadow-[0_0_30px_rgba(57,255,20,0.5)]">Sovereignty?</span>
                </h2>
                <p className="text-white/60 text-xl mb-16 max-w-2xl mx-auto font-bold uppercase tracking-[0.2em] relative z-10 leading-relaxed">
                  Join the mainnet and initialize your first neural entity in seconds. <br />
                  <span className="text-white/80">Experience zero-friction intelligence.</span>
                </p>
                <div className="relative z-10 flex justify-center">
                  <LandingPrimaryAction label="Launch_Terminal" className="px-24 py-8 bg-gemigram-neon text-black rounded-full text-2xl font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(57,255,20,0.4)] transition-all" />
                </div>
              </div>
            </div>
          </section>
        </main>

        <EnterpriseFooter />
      </div>
    </LandingInteractiveProvider>
  );
}
