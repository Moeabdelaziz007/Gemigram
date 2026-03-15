'use client';

import { useAuth } from '@/components/Providers';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sparkles, Fingerprint, Activity } from 'lucide-react';
import HeroBackground from '@/components/HeroBackground';
import NeuralPulse from '@/components/NeuralPulse';
import { DigitalEntity } from '@/components/DigitalEntity';

export default function LandingPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-aether-black">
      <HeroBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-20 pb-20 px-4 md:px-8 lg:px-20 z-10">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: Vision & Action */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-aether-neon/10 border border-aether-neon/20 text-aether-neon text-[11px] uppercase tracking-[0.2em] font-black mb-6 md:mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Protocol V2.0 Active</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-6 md:mb-8">
              <span className="text-white block">Gemigram</span>
              <span className="text-aether-neon">AI Operating System</span>
              <span className="text-white/50 text-lg sm:text-xl md:text-2xl font-light block mt-2">The Sovereign Intelligence Platform</span>
            </h1>

            <p className="text-base md:text-lg text-white/70 font-medium max-w-lg mb-8 md:mb-12 leading-relaxed">
              Deploy voice-native AI agents that autonomously handle your workspace. Built on Google's Sovereign Ecosystem—zero friction, infinite possibilities.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12 md:mb-16">
              <motion.button 
                onClick={login}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl bg-white text-black font-black text-sm md:text-base hover:bg-aether-neon transition-all duration-300 shadow-lg hover:shadow-aether-neon/50 active:scale-95 flex items-center gap-3 group whitespace-nowrap"
              >
                <Fingerprint className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                <span>Get Started</span>
              </motion.button>
              
              <motion.button 
                onClick={() => router.push('/hub')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl quantum-glass border border-white/20 hover:border-aether-neon/50 text-white font-bold text-sm md:text-base hover:bg-white/5 transition-all duration-300 flex items-center gap-3 group"
              >
                <span>Explore Agents</span>
                <Activity className="w-4 h-4 md:w-5 md:h-5 group-hover:text-aether-neon transition-colors" />
              </motion.button>
            </div>

            {/* Trust Bar */}
            <div className="flex items-center gap-4 md:gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/50 border-r border-white/10 pr-4 md:pr-8 whitespace-nowrap">Powered by</div>
              <div className="flex items-center gap-3 md:gap-6">
                <Image src="https://www.gstatic.com/images/branding/product/2x/firebase_64dp.png" alt="Firebase" width={20} height={20} className="opacity-70 w-5 h-5 md:w-6 md:h-6" />
                <Image src="https://www.gstatic.com/lamda/images/favicon_v1_150160d5dd06cf22b82.svg" alt="Gemini" width={20} height={20} className="w-5 h-5 md:w-6 md:h-6" />
                <Image src="https://www.gstatic.com/images/branding/product/2x/workspace_64dp.png" alt="GWS" width={20} height={20} className="opacity-70 w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mascot & Live Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
            className="relative flex flex-col items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-xs md:max-w-sm lg:max-w-md flex items-center justify-center">
              <div className="relative z-10 w-full h-full">
                <DigitalEntity volume={0.1} state="disconnected" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/[0.03] rounded-full animate-orbit" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-t border-aether-neon/10 rounded-full animate-orbit" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
            </div>

            <div className="relative z-20 w-full max-w-xs mt-8">
              <NeuralPulse />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-8 lg:px-20 z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">Why Choose Gemigram</h2>
            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">Everything you need to build, deploy, and manage autonomous AI agents</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Sparkles,
                title: "Voice-Native Agents",
                description: "Build AI agents that communicate naturally through voice and text in real-time."
              },
              {
                icon: Activity,
                title: "Real-Time Autonomy",
                description: "Deploy agents that operate independently and adapt to changing conditions instantly."
              },
              {
                icon: Fingerprint,
                title: "Sovereign Control",
                description: "Complete ownership and control over your AI entities and data with zero intermediaries."
              },
              {
                icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
                title: "Unified Dashboard",
                description: "Manage all your agents from a single, intuitive platform with real-time monitoring."
              },
              {
                icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                title: "Memory & Context",
                description: "Agents retain conversation history and learn from interactions over time."
              },
              {
                icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                title: "Flexible Customization",
                description: "Fine-tune agent behavior, capabilities, and personalities to match your needs."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group p-6 md:p-8 rounded-2xl quantum-glass border border-white/5 hover:border-aether-neon/20 hover:bg-white/[0.03] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-aether-neon/10 flex items-center justify-center mb-4 group-hover:bg-aether-neon/20 transition-colors">
                    <Icon className="w-6 h-6 text-aether-neon" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 lg:px-20 z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-aether-neon/10 to-transparent border border-aether-neon/20 p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 md:mb-6">Ready to Build?</h2>
            <p className="text-base md:text-lg text-white/70 mb-8 max-w-2xl mx-auto">Start creating autonomous AI agents today. No credit card required.</p>
            <motion.button
              onClick={login}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl bg-aether-neon text-black font-black text-base md:text-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-aether-neon/50"
            >
              Launch Platform
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
