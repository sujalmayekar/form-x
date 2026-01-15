import React from "react";
import Navbar from "./Navbar";
import {
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface LandingScreenProps {
  onCreate: (type: "quiz" | "survey") => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onCreate }) => (
  <div className="min-h-screen bg-slate-950 text-foreground overflow-hidden font-sans relative">
    <Navbar />

    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-40 -left-10 w-96 h-96 rounded-full blur-3xl opacity-40 bg-primary" />
      <div className="absolute top-20 right-0 w-[520px] h-[520px] rounded-full blur-[120px] opacity-30 bg-cyan-300" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_38%)]" />
    </div>

    <div className="relative pt-28 pb-16 px-6 sm:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-7">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-slate-300/80 bg-white/5 border border-white/10 px-3 py-1 rounded-full shadow-sm shadow-primary/30">
            Modern · Animated · Form Builder
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white drop-shadow-[0_10px_40px_rgba(37,99,235,0.25)]">
            Build elegant, animated forms with a live visual preview.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Spin up quizzes and surveys that look like production UI from the start—gradient shells, glass panels, and micro-interactions baked in.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onCreate("quiz")}
              className="px-5 py-3 bg-white text-slate-900 rounded-xl text-sm font-semibold shadow-xl shadow-primary/30 hover:-translate-y-0.5 transition-transform"
            >
              Create New Form
            </button>
            <button
              onClick={() => onCreate("survey")}
              className="px-5 py-3 rounded-xl border border-white/10 text-sm font-semibold text-foreground hover:bg-white/5 transition"
            >
              Start a Survey
            </button>
          </div>
          <div className="flex gap-6 pt-4 text-sm text-slate-300/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Auto-scoring quizzes
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-300" /> Response analytics
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.25),transparent_40%)]" />
            <div className="relative p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse-soft" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse-soft" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-300">Live preview</span>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-3/5 rounded-xl bg-white/10 border border-white/10 animate-fade-in" />
                <div className="space-y-3 animate-fade-in" style={{ animationDelay: '80ms' }}>
                  <div className="h-4 w-24 rounded-full bg-white/10" />
                  <div className="h-11 w-full rounded-xl bg-white/10 border border-white/10" />
                  <div className="h-11 w-11/12 rounded-xl bg-white/10 border border-white/10" />
                </div>
                <div className="space-y-3 animate-fade-in" style={{ animationDelay: '140ms' }}>
                  <div className="h-4 w-28 rounded-full bg-white/10" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
                    <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
                    <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
                    <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
                  </div>
                </div>
                <div className="flex justify-end pt-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <button className="px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-semibold shadow-lg shadow-primary/30">
                    Publish
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard icon={<Sparkles className="w-5 h-5 text-amber-300" />} title="Form Builder" desc="Add questions fast with drag handles, shimmers, and crisp inputs." />
        <FeatureCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} title="Quiz & Scoring" desc="Toggle scoring, set answers, and preview respondent experience." />
        <FeatureCard icon={<BarChart3 className="w-5 h-5 text-cyan-300" />} title="Response Analytics" desc="Filter, export, and visualize responses with soft gradients." />
      </div>
    </div>
  </div>
);

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/30 backdrop-blur-xl hover:-translate-y-1 transition-transform duration-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="text-sm text-slate-300">{desc}</p>
  </div>
);

export default LandingScreen;
