import Link from 'next/link';
import { Fingerprint } from 'lucide-react';
import { BRAND } from '@/lib/constants/branding';
import { LandingHeaderControls } from './HeaderControls';

const navLinks = [
  { name: 'Neural Hub', href: '/hub' },
  { name: 'Architecture', href: '#features' },
  { name: 'Security', href: '#security' },
  { name: 'Enterprise', href: '#enterprise' },
];

export function EnterpriseHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center border-b border-gemigram-neon/10 bg-[rgba(5,5,5,0.78)] backdrop-blur-xl">
      <div className="container mx-auto px-6 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <Fingerprint className="w-10 h-10 text-gemigram-neon group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gemigram-neon/20 blur-lg rounded-full" />
          </div>
          <span className="text-2xl font-black tracking-[-0.05em] text-white uppercase group-hover:tracking-wider transition-all duration-500">
            {BRAND.product.name.toUpperCase()}<span className="text-gemigram-neon">_</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-gemigram-neon transition-all">
              {link.name}
            </Link>
          ))}
        </nav>

        <LandingHeaderControls navLinks={navLinks} />
      </div>
    </header>
  );
}
