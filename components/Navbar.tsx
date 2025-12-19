import React from 'react';
import { Layout } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-20 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/15 p-2 rounded-lg border border-white/10">
            <Layout className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            Form X
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-200 hover:text-primary transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up">
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30">
                  Get Started
                </button>
              </Link>
           </SignedOut>

           <SignedIn>
              <Link href="/dashboard">
                <button className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-slate-100 hover:bg-white/5 transition-colors">
                  Create New Form
                </button>
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border border-white/10"
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
