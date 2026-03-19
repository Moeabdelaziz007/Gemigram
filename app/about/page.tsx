'use client';

import { motion } from 'framer-motion';
import { Brain, Cpu, Globe, Rocket, Users, Mail, Youtube, Twitter, Github } from 'lucide-react';
import AppShell from '@/components/AppShell';

export default function AboutPage() {
  const team = [
    { name: "Moe Abdelaziz", role: "Founding Architect", avatar: "MA" },
    { name: "Gemigram AI", role: "Core Intelligence", avatar: "AI" },
    { name: "Sovereign Devs", role: "The Collective", avatar: "SC" }
  ];

  return (
    <AppShell>
      <div className="min-h-screen pt-20 pb-20 px-6 md:px-12 max-w-7xl mx-auto selection:bg-gemigram-neon/20">
        
        {/* Hero Section */}
        <section className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative inline-block mb-12"
          >
            <div className="absolute inset-0 bg-gemigram-neon/20 blur-3xl rounded-full" />
            <div className="relative glass-strong p-8 rounded-full border border-gemigram-neon/30">
              <Brain className="w-16 h-16 text-gemigram-neon animate-pulse" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8"
          >
            THE ARCHITECTS OF <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gemigram-neon to-neon-blue">SOVEREIGNTY.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Gemigram GemigramOS is more than an app—it's a decentralized intelligence layer 
            designed to return autonomy to the people through Voice-First automation.
          </motion.p>
        </section>

        {/* Mission Card */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="glass-medium p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gemigram-neon/5 blur-[100px]" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Rocket className="text-gemigram-neon" />
                  OUR MISSION
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  We believe that the barrier between human intent and digital execution should be zero. 
                  By leveraging <span className="text-white">Gemini 3.1 Pro</span> and the <span className="text-white">Model Context Protocol</span>, we are building a world where you speak, and the digital universe listens.
                </p>
                <div className="flex gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-gemigram-neon/50 to-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { icon: Cpu, label: "Performance", val: "10x" },
                   { icon: Globe, label: "Scale", val: "Global" },
                   { icon: Users, label: "Community", val: "Sovereign" },
                   { icon: Brain, label: "IQ", val: "Top Tier" }
                 ].map((stat, i) => (
                   <div key={i} className="glass-subtle p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                      <stat.icon className="w-8 h-8 text-white/20 mb-3" />
                      <div className="text-2xl font-black text-gemigram-neon">{stat.val}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/30">{stat.label}</div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <section className="mb-32">
          <h2 className="text-center text-4xl font-black tracking-tight mb-16">THE CORE TEAM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-subtle p-8 rounded-3xl border border-white/5 text-center group hover:border-gemigram-neon/30 transition-all"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gemigram-neon/20 to-neon-blue/20 mx-auto flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white/80">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-white/30 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact/Social */}
        <footer className="text-center pt-20 border-t border-white/10">
           <div className="flex justify-center gap-8 mb-12">
              <a href="#" className="p-4 rounded-full glass-subtle hover:bg-gemigram-neon/10 transition-colors">
                <Github className="w-6 h-6 text-white/40" />
              </a>
              <a href="#" className="p-4 rounded-full glass-subtle hover:bg-gemigram-neon/10 transition-colors">
                <Twitter className="w-6 h-6 text-white/40" />
              </a>
              <a href="#" className="p-4 rounded-full glass-subtle hover:bg-gemigram-neon/10 transition-colors">
                <Youtube className="w-6 h-6 text-white/40" />
              </a>
              <a href="#" className="p-4 rounded-full glass-subtle hover:bg-gemigram-neon/10 transition-colors">
                <Mail className="w-6 h-6 text-white/40" />
              </a>
           </div>
           <p className="text-white/20 text-sm font-mono uppercase tracking-[0.3em]">
             Design your destiny.
           </p>
        </footer>

      </div>
    </AppShell>
  );
}
