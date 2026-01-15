import React from 'react';
import { Layout } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.25),transparent_30%)]" />
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="bg-white/5 p-2 rounded-lg border border-white/10 shadow-md shadow-primary/30">
            <Layout className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">
            Form X
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
           <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up">
                <button className="px-4 py-2 rounded-xl bg-white text-slate-900 text-sm font-semibold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform">
                  Get Started
                </button>
              </Link>
           </SignedOut>

           <SignedIn>
              <Link href="/dashboard">
                <button className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold text-slate-100 hover:bg-white/5 transition-colors">
                  Dashboard
                </button>
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border border-white/10 shadow-sm shadow-black/30"
                  }
                }}
              />
           </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
