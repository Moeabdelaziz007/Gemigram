'use client';

import { useAuth } from '@/components/Providers';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LiquidWidget } from '@/components/ui/LiquidWidget';
import { fetchDriveFiles, GWSFile } from '@/lib/gws-tools';
import { Layers, Database, Cpu, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, googleAccessToken } = useAuth();
  const { agents } = useGemigramStore();
  const router = useRouter();
  const [driveFiles, setDriveFiles] = useState<GWSFile[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    if (googleAccessToken) {
      fetchDriveFiles(googleAccessToken, 3)
        .then(setDriveFiles)
        .catch(console.error);
    }
  }, [user, googleAccessToken, router]);

  if (!user) return null;

  return (
    <div className="page-shell page-stack py-4 sm:py-6 md:py-8 min-h-screen relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gemigram-neon/5 blur-[140px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <section className="relative z-10 flex flex-col gap-4 rounded-[2rem] border border-white/10 glass-strong p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
        <div className="space-y-2">
          <p className="page-kicker">Neural_Entity_Manager</p>
          <h1 className="page-title leading-tight">Sovereign_OS <span className="text-gemigram-neon/50 text-sm font-black tracking-[0.3em] ml-2 animate-pulse font-mono">V3.0_LIQUID</span></h1>
          <p className="page-copy max-w-2xl text-white/60">Interaction layer stabilized. Your workspace intelligence is now active and decentralized.</p>
        </div>
        <button onClick={() => router.push('/hub')} className="btn-primary w-full sm:w-auto shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_50px_rgba(57,255,20,0.5)]">
          Access_Hub
        </button>
      </section>

      {/* Liquid Interaction Layer */}
      <div className="relative z-20 flex flex-wrap gap-8 py-12">
        
        {/* Agent Overview Widget */}
        <LiquidWidget title="Active_Entities" icon={<Layers className="w-3.5 h-3.5" />}>
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{agents.length}</span>
              <span className="text-[10px] text-gemigram-neon mb-1.5 uppercase font-bold tracking-widest">Online</span>
            </div>
            <div className="space-y-2">
              {agents.slice(0, 3).map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span className="truncate max-w-[120px] font-bold text-white/80">{agent.name}</span>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <p className="italic opacity-30 text-[10px] py-4 text-center border border-dashed border-white/10 rounded-xl">No entities detected.</p>
              )}
            </div>
          </div>
        </LiquidWidget>

        {/* GWS Intelligence Widget */}
        <LiquidWidget title="Vault_Link" icon={<HardDrive className="w-3.5 h-3.5" />}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Database className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Latest_Synchronized_Assets</span>
            </div>
            <div className="space-y-2">
              {driveFiles.map(file => (
                <div key={file.id} className="text-[10px] p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/file">
                  <p className="text-white/80 font-bold truncate group-hover/file:text-blue-400 transition-colors">{file.name}</p>
                  <p className="text-[8px] opacity-40 uppercase truncate mt-0.5">{file.mimeType.split('.').pop()}</p>
                </div>
              ))}
              {driveFiles.length === 0 && (
                <div className="flex flex-col items-center py-4 opacity-20">
                  <RefreshCcw className="w-4 h-4 animate-spin-slow mb-2" />
                  <p className="text-[8px] uppercase tracking-tighter">Syncing_Drive...</p>
                </div>
              )}
            </div>
          </div>
        </LiquidWidget>

        {/* System Health Widget */}
        <LiquidWidget title="Neural_Core" icon={<Cpu className="w-3.5 h-3.5" />}>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter text-white/40">
                <span>ORCHESTRATION</span>
                <span className="text-gemigram-neon">FLASH_2.0</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gemigram-neon shadow-[0_0_10px_#3D83D9]"
                  animate={{ width: ['20%', '95%', '70%', '100%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gemigram-neon/5 border border-gemigram-neon/10">
              <p className="text-[10px] leading-relaxed text-white/60">
                Sovereign link is <span className="text-gemigram-neon">FULLY STABLE</span>. Multi-agent swarm logic is primed for activation.
              </p>
            </div>
          </div>
        </LiquidWidget>

      </div>
    </div>
  );
}

const RefreshCcw = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);
