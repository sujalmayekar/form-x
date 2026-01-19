'use client';

import React from "react";
import Navbar from "./Navbar";
import { ArrowRight, BarChart2, Plus, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface LandingScreenProps {
  onCreate: (type: "quiz" | "survey" | "invoice") => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onCreate }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-white selection:text-black">
      {/* Technical Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 technical-grid" />

      <div className="relative z-10">
        <Navbar />

        <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-24 space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-300 hover:scale-105 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-zinc-400 tracking-tight transition-colors duration-300 hover:text-zinc-300">V2.0 NOW LIVE</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white leading-[1.1] animate-slide-up" style={{ animationDelay: '0.1s' }}>
              The new standard for <br />
              <span className="italic text-zinc-400 transition-all duration-300 hover:text-zinc-300">engineering forms.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed animate-slide-up transition-all duration-300 hover:text-zinc-300" style={{ animationDelay: '0.2s' }}>
              Build production-ready surveys and quizzes with a precision-first toolchain.
              No drag-and-drop bloat. Just pure functional design.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onCreate("quiz")}
                className="group relative px-6 py-3 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10 active:scale-95 button-press ripple overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Quiz
                  <ArrowRight className="w-4 h-4 ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                </span>
              </button>
              <button
                onClick={() => onCreate("survey")}
                className="px-6 py-3 border border-zinc-800 text-zinc-300 text-sm font-medium rounded-md hover:border-zinc-700 hover:text-white transition-all duration-300 bg-black/20 hover:scale-105 hover:bg-white/5 hover:shadow-lg button-press ripple"
              >
                Start Survey
              </button>
              <button
                onClick={() => onCreate("invoice")}
                className="px-6 py-3 border border-zinc-800 text-zinc-300 text-sm font-medium rounded-md hover:border-zinc-700 hover:text-white transition-all duration-300 bg-black/20 hover:scale-105 hover:bg-white/5 hover:shadow-lg button-press ripple flex items-center gap-2"
              >
                <span className="text-emerald-500 font-mono text-xs">NEW</span>
                Create Invoice
              </button>
            </div>
          </div>

          {/* Bento Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 h-auto md:h-[600px]">

            {/* Card 1: Form Editor Mockup (Large Left) */}
            <div className="md:col-span-4 glass-card rounded-xl p-6 relative overflow-hidden group hover-lift animate-fade-in">
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 transition-all duration-300 group-hover:bg-red-500/50 group-hover:border-red-400" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 transition-all duration-300 group-hover:bg-yellow-500/50 group-hover:border-yellow-400" />
                </div>
                <div className="text-[10px] font-mono text-zinc-500 transition-all duration-300 group-hover:text-zinc-400">EDITOR_PREVIEW.TSX</div>
              </div>

              {/* Abstract UI Representation */}
              <div className="mt-10 space-y-4 opacity-50 group-hover:opacity-100 transition-all duration-700">
                <div className="h-8 w-1/3 bg-zinc-800/50 rounded-md border border-white/5 animate-pulse transition-all duration-300 group-hover:bg-zinc-700/50" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-zinc-800/30 rounded border border-white/5 transition-all duration-300 group-hover:bg-zinc-700/30" />
                  <div className="h-4 w-5/6 bg-zinc-800/30 rounded border border-white/5 transition-all duration-300 group-hover:bg-zinc-700/30" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="h-24 bg-zinc-900 rounded-lg border border-zinc-800 p-3 space-y-2 transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-800/50">
                    <div className="h-2 w-8 bg-zinc-700 rounded transition-all duration-300 group-hover:bg-zinc-600" />
                    <div className="h-full w-full bg-zinc-800/50 rounded border-t border-zinc-800 transition-all duration-300 group-hover:bg-zinc-700/50" />
                  </div>
                  <div className="h-24 bg-zinc-900 rounded-lg border border-zinc-800 p-3 space-y-2 transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-800/50">
                    <div className="h-2 w-8 bg-zinc-700 rounded transition-all duration-300 group-hover:bg-zinc-600" />
                    <div className="h-full w-full bg-zinc-800/50 rounded border-t border-zinc-800 transition-all duration-300 group-hover:bg-zinc-700/50" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 transition-opacity duration-700 group-hover:opacity-70" />
              <div className="absolute bottom-6 left-6 z-20 transition-all duration-300 group-hover:translate-y-[-4px]">
                <h3 className="font-serif text-2xl text-white mb-1 transition-all duration-300 group-hover:text-white">Visual Editor</h3>
                <p className="text-zinc-400 text-sm transition-all duration-300 group-hover:text-zinc-300">Real-time preview with pixel-perfect rendering.</p>
              </div>
            </div>

            {/* Card 2: Analytics (Top Right) */}
            <div className="md:col-span-2 glass-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute top-0 right-0 p-4 opacity-20 transform rotate-12 group-hover:rotate-0 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110">
                <BarChart2 className="w-24 h-24 text-white transition-all duration-500" />
              </div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-zinc-800 group-hover:border-zinc-700 group-hover:scale-110 group-hover:rotate-3">
                  <Zap className="w-5 h-5 text-white transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-110" />
                </div>
                <h3 className="font-medium text-white transition-all duration-300 group-hover:translate-x-1">Instant Analytics</h3>
                <p className="text-xs text-zinc-500 mt-1 transition-all duration-300 group-hover:text-zinc-400">Real-time data synchronization.</p>
              </div>

              <div className="mt-8 flex items-end gap-1 h-24">
                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-600 transition-all duration-300 rounded-t-sm hover:scale-105 cursor-pointer"
                    style={{
                      height: `${h}%`,
                      transitionDelay: `${i * 50}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Card 3: Responses (Bottom Right) */}
            <div className="md:col-span-2 glass-card rounded-xl p-6 relative overflow-hidden group hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-white transition-all duration-300 group-hover:translate-x-1">Respondent Flow</h3>
                <Users className="w-4 h-4 text-zinc-500 transition-all duration-300 group-hover:text-zinc-400 group-hover:scale-110 group-hover:rotate-3" />
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 hover:translate-x-1 hover:shadow-md cursor-pointer"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500 transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 hover:scale-110">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-16 bg-zinc-800 rounded mb-1 transition-all duration-300 hover:bg-zinc-700" />
                      <div className="h-1.5 w-10 bg-zinc-900 rounded transition-all duration-300 hover:bg-zinc-800" />
                    </div>
                    <div className="text-xs font-mono text-emerald-500 transition-all duration-300 hover:scale-110">204ms</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Explore Templates (Bottom Left) */}
            <div
              onClick={() => router.push('/templates')}
              className="md:col-span-4 glass-card rounded-xl p-8 relative overflow-hidden group hover-lift cursor-pointer animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="relative z-10 h-full flex flex-col justify-center max-w-lg">
                <h3 className="font-serif text-4xl md:text-5xl mb-4 italic tracking-tight transition-all duration-300 group-hover:translate-x-1 bg-gradient-to-r from-[#fff200] to-[#ff8000] bg-clip-text text-transparent">Explore Templates</h3>
                <p className="text-zinc-400 text-lg leading-relaxed transition-all duration-300 group-hover:text-zinc-300">
                  Templates allow you to quickly create forms using predefined structures and commonly used fields.
                  This helps reduce repetitive work, saves time, and ensures consistency.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span>Browse Library</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* Decorative Bg Elements */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-500">
                <div className="w-64 h-80 border border-zinc-800 rounded-xl transform rotate-12 bg-zinc-900/50 backdrop-blur-md" />
              </div>
            </div>

          </div>

          {/* Footer / Trust signal */}
          <div className="mt-20 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs text-zinc-600 font-mono">
              ENGINEERED FOR MODERN TEAMS
            </p>
            <div className="flex gap-6">
              {["Linear", "Vercel", "Raycast"].map((brand) => (
                <span key={brand} className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">{brand}</span>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default LandingScreen;
