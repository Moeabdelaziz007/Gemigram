import { CheckCircle2, Globe, Package } from 'lucide-react';

const cards = [
  {
    title: 'Model Context Protocol',
    icon: Package,
    accent: {
      border: 'border-neon-green/20',
      surface: 'bg-neon-green/10',
      text: 'text-neon-green',
      iconBorder: 'border-neon-green/30',
      gradient: 'from-neon-green/10',
      bullet: 'bg-neon-green/20',
    },
    items: [
      { title: 'GitHub Integration', desc: 'Repository management, PR reviews, issues, and actions.' },
      { title: 'MCP Marketplace', desc: 'Discover and install MCP servers instantly.' },
      { title: 'JSON-RPC 2.0', desc: 'Standardized transport for interoperable AI tools.' },
    ],
  },
  {
    title: 'API Marketplace',
    icon: Globe,
    accent: {
      border: 'border-neon-blue/20',
      surface: 'bg-neon-blue/10',
      text: 'text-neon-blue',
      iconBorder: 'border-neon-blue/30',
      gradient: 'from-neon-blue/10',
      bullet: 'bg-neon-blue/20',
    },
    items: [
      { title: '20,000+ APIs', desc: 'RapidAPI and APILayer connectivity from one control plane.' },
      { title: 'Secure Credentials', desc: 'Encrypted storage plus robust OAuth flows.' },
      { title: 'Usage Tracking', desc: 'Real-time monitoring, alerts, and quota management.' },
    ],
  },
];

export function IntegrationsShowcase() {
  return (
    <section className="py-32 relative bg-carbon-black/50 overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-green/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
            Limitless <span className="text-neon-green drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Integrations</span>
          </h2>
          <p className="text-xl text-white/50 max-w-3xl mx-auto font-light tracking-wide">
            Connect to GitHub, access 20,000+ APIs, and integrate with external models via MCP protocol.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div key={card.title} className={`glass-strong p-10 rounded-[2.5rem] border relative group overflow-hidden ${card.accent.border}`}>
              <div className={`absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${card.accent.gradient}`} />

              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${card.accent.surface} ${card.accent.iconBorder}`}>
                    <card.icon className={`w-8 h-8 ${card.accent.text}`} />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight">{card.title}</h3>
                </div>
                <ul className="space-y-6">
                  {card.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${card.accent.bullet}`}>
                        <CheckCircle2 className={`w-4 h-4 ${card.accent.text}`} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg mb-1">{item.title}</div>
                        <div className="text-white/50 text-sm leading-relaxed">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
