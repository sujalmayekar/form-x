import React from 'react';
import { Layout } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl animate-slide-up">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2 rounded-md border border-white/10 shadow-sm group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-lg">
            <Layout className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight text-white group-hover:opacity-90 transition-all duration-300 group-hover:translate-x-0.5">
            Form X
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Sign In
              </button>
            </SignInButton>
            <Link href="/sign-up">
              <button className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all duration-300 hover:scale-105 hover:shadow-lg button-press ripple">
                Get Started
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <button className="hidden sm:inline-flex px-4 py-2 rounded-md border border-white/10 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-md button-press">
                Dashboard
              </button>
            </Link>
            <div className="transition-transform duration-300 hover:scale-110">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-md"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
