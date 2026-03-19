import React from 'react';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { Database, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProjectSwitcher() {
  const { userProjects, activeProjectId, setActiveProjectId } = useGemigramStore();
  const [isOpen, setIsOpen] = React.useState(false);

  if (userProjects.length === 0) return null;

  const activeProject = userProjects.find(p => p.id === activeProjectId) || userProjects[0];

  return (
    <div className="relative pointer-events-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg quantum-glass border border-white/10 hover:border-aether-neon/50 transition-colors group"
      >
        <Database className="w-3.5 h-3.5 text-aether-neon" />
        <div className="flex flex-col items-start">
          <span className="text-[8px] font-black uppercase tracking-widest text-white/30 leading-none mb-0.5">Active Project</span>
          <span className="text-[10px] font-bold text-white/90 truncate max-w-[120px]">{activeProject.name}</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 p-2 rounded-xl quantum-glass border border-white/10 shadow-2xl z-[200] backdrop-blur-3xl"
          >
            <div className="px-2 py-1.5 mb-2 border-b border-white/5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-aether-neon/60">Select Sovereignty</span>
            </div>
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
              {userProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProjectId(project.id);
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-start px-3 py-2 rounded-lg transition-all ${
                    activeProjectId === project.id 
                      ? 'bg-aether-neon/10 border border-aether-neon/30' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-[11px] font-bold text-white">{project.name}</span>
                  <span className="text-[9px] font-mono text-white/40">{project.id}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
