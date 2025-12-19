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
  <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
    <Navbar />

    <div className="pt-28 pb-16 px-6 sm:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Modern · Minimal · Form Builder
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Build calm, professional forms that feel like a modern SaaS.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Create quizzes, surveys, and response pages with a clean dark UI, ready to share instantly.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onCreate("quiz")}
              className="px-5 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition"
            >
              Create New Form
            </button>
            <button
              onClick={() => onCreate("survey")}
              className="px-5 py-3 rounded-full border border-white/10 text-sm font-semibold text-foreground hover:bg-white/5 transition"
            >
              Start a Survey
            </button>
          </div>
          <div className="flex gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Auto-scoring quizzes
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Response analytics
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative bg-card border border-border/60 rounded-2xl p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-red-400" />
              </div>
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
            <div className="space-y-5">
              <div className="h-10 w-3/5 rounded-lg bg-white/5 border border-white/5" />
              <div className="space-y-3">
                <div className="h-4 w-24 rounded-full bg-white/5" />
                <div className="h-10 w-full rounded-lg bg-white/5 border border-white/5" />
                <div className="h-10 w-11/12 rounded-lg bg-white/5 border border-white/5" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-28 rounded-full bg-white/5" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-12 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-12 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-12 rounded-lg bg-white/5 border border-white/5" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30">
                  Publish
                </button>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/5" />
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard icon={<Sparkles className="w-5 h-5 text-primary" />} title="Form Builder" desc="Add questions fast with clear drag-and-drop cues." />
        <FeatureCard icon={<CheckCircle2 className="w-5 h-5 text-primary" />} title="Quiz & Scoring" desc="Toggle scoring, set answers, and keep results tidy." />
        <FeatureCard icon={<BarChart3 className="w-5 h-5 text-primary" />} title="Response Analytics" desc="Filter, export, and get a clean overview of responses." />
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
  <div className="bg-card border border-white/5 rounded-xl p-5 shadow-lg shadow-black/20">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </div>
);

export default LandingScreen;
