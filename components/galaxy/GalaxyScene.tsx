'use client';

import { useAetherStore } from '@/lib/store/useAetherStore';
import { Brain, Globe, ZoomIn, ZoomOut, Move, Network, Radio } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { BRAND } from '@/lib/constants/branding';
import { useVisualTier } from '@/lib/hooks/useVisualTier';

export default function GalaxyScene() {
  const { agents, setActiveAgentId, activeAgentId } = useAetherStore();
  const router = useRouter();
  const { tier, allowMotion, allowAmbientMotion, allowHeavyEffects, isMobile } = useVisualTier();
  const [zoom, setZoom] = useState(1);
  const [showConnections, setShowConnections] = useState(() => tier === 'desktop');
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const galaxySceneRef = useRef<HTMLDivElement>(null);
  const [sceneSize, setSceneSize] = useState({ width: 0, height: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-12, 12]);
  const reverseParallaxX = useTransform(parallaxX, (x) => -x * 0.5);
  const reverseParallaxY = useTransform(parallaxY, (y) => -y * 0.5);

  useEffect(() => {
    setShowConnections(tier === 'desktop');
  }, [tier]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!allowAmbientMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    if (!galaxySceneRef.current) return;

    const updateSceneSize = () => {
      if (!galaxySceneRef.current) return;
      const { width, height } = galaxySceneRef.current.getBoundingClientRect();
      setSceneSize({ width, height });
    };

    updateSceneSize();
    const observer = new ResizeObserver(updateSceneSize);
    observer.observe(galaxySceneRef.current);

    return () => observer.disconnect();
  }, []);

  const getOrbitConfig = (index: number) => {
    const radius = (isMobile ? 112 : 200) + index * (isMobile ? 22 : 45);
    const duration = 25 + index * 6;
    const delay = index * -4;
    return { radius, duration, delay };
  };

  const getAgentProjectedPosition = (index: number) => {
    const { radius, duration, delay } = getOrbitConfig(index);
    const centerX = sceneSize.width / 2;
    const centerY = sceneSize.height / 2;
    const initialOffsetProgress = (-delay / duration) % 1;
    const angle = Math.PI + (initialOffsetProgress * Math.PI * 2);
    const scaledRadius = radius * zoom;

    return {
      x: centerX + Math.cos(angle) * scaledRadius,
      y: centerY + Math.sin(angle) * scaledRadius,
    };
  };

  const startHintPress = (hint: string) => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setActiveHint(hint), 450);
  };

  const endHintPress = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setActiveHint(null);
  };

  useEffect(() => () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative mx-auto flex h-full max-w-6xl flex-col overflow-hidden p-4 md:p-8"
      data-visual-tier={tier}
    >
      <motion.div
        initial={allowMotion ? { opacity: 0, y: -20 } : false}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-4 top-4 z-30 flex flex-col gap-2 md:right-8 md:top-8"
      >
        <div className="relative group flex justify-center">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
            aria-label="Zoom in galaxy view"
            title="Zoom in galaxy view"
            onTouchStart={() => startHintPress('zoom-in')}
            onTouchEnd={endHintPress}
            onTouchCancel={endHintPress}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 glass-subtle transition-all hover:border-gemigram-neon/50 hover:bg-gemigram-neon/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
          >
            <ZoomIn aria-hidden="true" className="h-4 w-4 text-white/60 group-hover:text-gemigram-neon" />
          </button>
          <span className={`pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 rounded-lg border border-white/10 bg-black/85 px-2 py-1 text-[10px] uppercase tracking-wider text-white/80 transition-opacity duration-200 md:group-hover:visible md:group-hover:opacity-100 ${activeHint === 'zoom-in' ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            Zoom In
          </span>
        </div>

        <div className="relative group flex justify-center">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            aria-label="Zoom out galaxy view"
            title="Zoom out galaxy view"
            onTouchStart={() => startHintPress('zoom-out')}
            onTouchEnd={endHintPress}
            onTouchCancel={endHintPress}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 glass-subtle transition-all hover:border-gemigram-neon/50 hover:bg-gemigram-neon/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
          >
            <ZoomOut aria-hidden="true" className="h-4 w-4 text-white/60 group-hover:text-gemigram-neon" />
          </button>
          <span className={`pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 rounded-lg border border-white/10 bg-black/85 px-2 py-1 text-[10px] uppercase tracking-wider text-white/80 transition-opacity duration-200 md:group-hover:visible md:group-hover:opacity-100 ${activeHint === 'zoom-out' ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            Zoom Out
          </span>
        </div>

        <div className="relative group flex justify-center">
          <button
            onClick={() => setShowConnections((current) => !current)}
            aria-label={showConnections ? 'Hide neural connections' : 'Show neural connections'}
            title={showConnections ? 'Hide neural connections' : 'Show neural connections'}
            onTouchStart={() => startHintPress('connections')}
            onTouchEnd={endHintPress}
            onTouchCancel={endHintPress}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80 ${showConnections ? 'border-gemigram-neon/50 bg-gemigram-neon/10' : 'border-white/10 glass-subtle'}`}
          >
            <Network aria-hidden="true" className={`h-4 w-4 ${showConnections ? 'text-gemigram-neon' : 'text-white/60 group-hover:text-white'}`} />
          </button>
          <span className={`pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 rounded-lg border border-white/10 bg-black/85 px-2 py-1 text-[10px] uppercase tracking-wider text-white/80 transition-opacity duration-200 md:group-hover:visible md:group-hover:opacity-100 ${activeHint === 'connections' ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            {showConnections ? 'Hide Connections' : 'Show Connections'}
          </span>
        </div>

        <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 glass-subtle md:flex">
          <Move aria-hidden="true" className="h-4 w-4 text-white/40" />
        </div>
      </motion.div>

      <div className="relative z-20 mb-10 md:mb-12">
        <motion.div initial={allowMotion ? { opacity: 0, x: -40 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="bg-gradient-to-r from-gemigram-neon via-white to-gemigram-neon bg-clip-text text-3xl font-black uppercase tracking-tighter text-transparent md:text-5xl">
            {BRAND.subProducts.galaxy}
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Sovereign Planet Architecture // Live Orchestration</p>
        </motion.div>
      </div>

      <div ref={galaxySceneRef} className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,255,135,0.05)_0%,transparent_70%)]" />
          <motion.div
            style={allowAmbientMotion ? { x: parallaxX, y: parallaxY } : undefined}
            className="absolute left-[-10%] top-[-14%] h-[46%] w-[56%] rounded-full bg-gradient-to-br from-gemigram-neon/5 to-transparent blur-[56px] md:blur-[72px]"
          />
          {allowHeavyEffects && (
            <motion.div
              style={{ x: reverseParallaxX, y: reverseParallaxY }}
              className="absolute bottom-[-18%] right-[-8%] h-[44%] w-[48%] rounded-full bg-gradient-to-tl from-gemigram-neon/5 to-transparent blur-[72px]"
            />
          )}
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.025]" />
          <div className="absolute inset-0 opacity-25 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI4MCIgcj0iMC41IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTIwIiByPSIwLjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-[length:200px_200px] bg-repeat" />
        </div>

        <motion.div style={{ scale: zoom }} className="relative z-30 group">
          <motion.div
            animate={allowAmbientMotion ? { scale: [1, 1.12, 1], opacity: [0.24, 0.4, 0.24] } : { scale: 1, opacity: 0.22 }}
            transition={allowAmbientMotion ? { duration: 8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
            className="pointer-events-none absolute -inset-12 rounded-full bg-gradient-to-br from-gemigram-neon/15 via-neon-blue/5 to-transparent blur-[48px] md:-inset-16 md:blur-[60px]"
          />

          <div className="relative z-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gemigram-neon/50 bg-black/80 shadow-[0_0_48px_rgba(57,255,20,0.25)] md:h-24 md:w-24 md:border-2 md:shadow-[0_0_72px_rgba(57,255,20,0.3)]">
            {allowAmbientMotion && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-1 rounded-full border border-dashed border-gemigram-neon/25"
              />
            )}
            {allowAmbientMotion && <div className="absolute left-0 top-0 h-2 w-full animate-[scanline_3s_linear_infinite] bg-gemigram-neon/60 opacity-40 blur-sm" />}
            <Brain aria-hidden="true" className="relative z-10 h-8 w-8 text-gemigram-neon md:h-10 md:w-10" />
          </div>

          <div className="absolute left-1/2 top-full mt-5 -translate-x-1/2 whitespace-nowrap rounded-full border border-gemigram-neon/15 bg-black/45 px-3 py-1.5 md:px-4 glass-subtle">
            <motion.div
              animate={allowMotion ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.85 }}
              transition={allowMotion ? { duration: 2.4, repeat: Infinity } : { duration: 0 }}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-gemigram-neon md:text-[10px] md:tracking-[0.4em]"
            >
              CORE_OS_ACTIVE
            </motion.div>
          </div>
        </motion.div>

        {[160, 240, 320].map((r, i) => (
          <motion.div
            key={i}
            style={{ scale: zoom, width: r * 2, height: r * 2 }}
            className="pointer-events-none absolute rounded-full border border-dashed border-white/5"
            animate={allowAmbientMotion ? { borderColor: ['rgba(16,255,135,0.05)', 'rgba(255,255,255,0.02)', 'rgba(16,255,135,0.05)'] } : { borderColor: 'rgba(255,255,255,0.03)' }}
            transition={allowAmbientMotion ? { duration: 5, repeat: Infinity } : { duration: 0 }}
          />
        ))}

        {showConnections && agents.length > 1 && sceneSize.width > 0 && !isMobile && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${sceneSize.width} ${sceneSize.height}`}>
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(16,255,135,0)" />
                <stop offset="50%" stopColor="rgba(16,255,135,0.24)" />
                <stop offset="100%" stopColor="rgba(16,255,135,0)" />
              </linearGradient>
            </defs>
            {agents.map((agent, i) => {
              const nextIndex = (i + 1) % agents.length;
              const centerX = sceneSize.width / 2;
              const centerY = sceneSize.height / 2;
              const currentPosition = getAgentProjectedPosition(i);
              const nextPosition = getAgentProjectedPosition(nextIndex);
              const connectToCore = i % 2 === 0;
              const lineStart = connectToCore ? { x: centerX, y: centerY } : currentPosition;
              const lineEnd = connectToCore ? currentPosition : nextPosition;

              return (
                <motion.line
                  key={`connection-${agent.id}`}
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                  stroke="url(#connectionGradient)"
                  strokeWidth="1"
                  initial={allowMotion ? { pathLength: 0, opacity: 0 } : false}
                  animate={{ pathLength: 1, opacity: 0.18 }}
                  transition={{ duration: 1.2, delay: i * 0.1 }}
                />
              );
            })}
          </svg>
        )}

        {agents.map((agent, i) => {
          const { radius, duration, delay } = getOrbitConfig(i);
          const projectedPosition = getAgentProjectedPosition(i);
          const button = (
            <button
              onClick={() => {
                setActiveAgentId(agent.id);
                router.push('/workspace');
              }}
              aria-label={`Open workspace for ${agent.name}`}
              title={`Open workspace for ${agent.name}`}
              className="group relative flex flex-col items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
            >
              <motion.div
                whileHover={allowHeavyEffects ? { scale: 1.12 } : undefined}
                className={`relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 md:h-14 md:w-14 ${activeAgentId === agent.id ? 'border-gemigram-neon bg-gemigram-neon/18 shadow-[0_0_28px_rgba(57,255,20,0.35)]' : 'border-white/10 bg-black/65 hover:border-gemigram-neon/40 hover:bg-gemigram-neon/8'}`}
              >
                {activeAgentId === agent.id && allowAmbientMotion && (
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full border border-gemigram-neon/70"
                  />
                )}
                <Globe aria-hidden="true" className={`h-5 w-5 transition-colors duration-300 md:h-6 md:w-6 ${activeAgentId === agent.id ? 'text-gemigram-neon' : 'text-white/45 group-hover:text-gemigram-neon'}`} />
                <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-black bg-gemigram-neon shadow-[0_0_8px_rgba(57,255,20,0.7)]" />

                {!isMobile && (
                  <div className="pointer-events-none absolute left-full z-50 ml-5 translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <div className="min-w-[180px] overflow-hidden rounded-2xl border border-gemigram-neon/25 bg-black/78 p-4 glass-subtle shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                      <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/45">Entity // {String(i + 1).padStart(2, '0')}</div>
                      <div className="mb-1.5 truncate text-sm font-black text-white">{agent.name}</div>
                      <div className="truncate font-mono text-[9px] uppercase tracking-wide text-gemigram-neon">{agent.role}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            </button>
          );

          if (!allowAmbientMotion) {
            return (
              <div
                key={agent.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: projectedPosition.x, top: projectedPosition.y }}
              >
                {button}
              </div>
            );
          }

          return (
            <motion.div
              key={agent.id}
              animate={{ rotate: 360 }}
              transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
              className="pointer-events-none absolute z-20"
              style={{ width: radius * 2, height: radius * 2, scale: zoom }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
                className="pointer-events-auto absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                {button}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={allowMotion ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 right-8 z-20 hidden lg:block"
      >
        <div className="w-72 rounded-[2rem] border border-gemigram-neon/15 bg-black/35 p-5 glass-subtle">
          <div className="mb-4 flex items-center gap-2">
            <Network aria-hidden="true" className="h-4 w-4 text-gemigram-neon" />
            <div className="text-[10px] font-black uppercase tracking-widest text-gemigram-neon">Sync Telemetry</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Entities_Registry</span>
              <span className="text-xs font-bold text-gemigram-neon">{agents.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Neural_Load</span>
              <span className="text-xs font-bold text-gemigram-neon">99.8%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/5 bg-white/5">
              <motion.div initial={allowMotion ? { width: '0%' } : false} animate={{ width: '99.8%' }} transition={{ duration: 1.2, delay: 0.3 }} className="h-full bg-gemigram-neon shadow-[0_0_10px_rgba(16,255,135,0.35)]" />
            </div>
            <div className="border-t border-white/10 pt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px] uppercase text-white/30">View Scale</span>
                <span className="font-mono text-[9px] text-gemigram-neon">{(zoom * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div className="h-full bg-gradient-to-r from-gemigram-neon to-neon-blue" animate={{ width: `${((zoom - 0.6) / 1.4) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={allowMotion ? { opacity: 0, x: -20 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-8 z-20 hidden lg:block"
      >
        <div className="w-80 rounded-[2rem] border border-white/5 bg-black/35 p-5 glass-subtle">
          <div className="mb-6 flex items-center gap-2">
            <Radio aria-hidden="true" className={`h-4 w-4 text-gemigram-neon ${allowMotion ? 'animate-pulse' : ''}`} />
            <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Cosmic_Pulse</div>
          </div>

          <div className="space-y-4 font-mono">
            <ActivityItem time="01:28" text="Entity_Sovereign materialized in Alpha_Sector" />
            <ActivityItem time="01:25" text="Neural sync optimized for 12/12 agents" />
            <ActivityItem time="01:12" text="Memory pruning complete across Gemigalaxy" />
            <ActivityItem time="00:58" text="MCP Bridge: GitHub_v3 successfully linked" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ActivityItem({ time, text }: { time: string; text: string }) {
  return (
    <div className="flex items-start gap-3 border-l border-white/5 pl-3">
      <span className="mt-1 text-[8px] font-black text-gemigram-neon">{time}</span>
      <span className="text-[9px] uppercase tracking-wider text-white/40">{text}</span>
    </div>
  );
}
