'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, Calendar, Eye } from 'lucide-react';

interface Form {
  _id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'survey';
  createdAt: string;
  updatedAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/forms');
      const data = await res.json();
      if (data.success) {
        setForms(data.forms);
        // Fetch response counts for each form
        const counts: Record<string, number> = {};
        await Promise.all(
          data.forms.map(async (form: Form) => {
            try {
              const resCount = await fetch(`/api/forms/${form._id}/responses`);
              const dataCount = await resCount.json();
              if (dataCount.success) {
                counts[form._id] = dataCount.responses?.length || 0;
              }
            } catch (err) {
              counts[form._id] = 0;
            }
          })
        );
        setResponseCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-foreground relative overflow-hidden">
      <Navbar />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 w-80 h-80 rounded-full blur-3xl opacity-30 bg-primary" />
        <div className="absolute top-10 right-0 w-[420px] h-[420px] rounded-full blur-[110px] opacity-25 bg-cyan-300" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.04),transparent_40%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto pt-28 px-6 pb-16 space-y-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/30 backdrop-blur-xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Your Forms
            </h1>
            <p className="text-slate-300">
              Create, organize, and analyze forms with a sleek, animated workspace.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl border border-white/15 text-sm font-semibold text-white hover:bg-white/5 transition"
            >
              + Create New Form
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse-soft" />
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="border border-dashed border-white/15 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-xl">
            <FileText size={48} className="text-muted-foreground/60" />
            <p className="text-slate-300 text-center">
              No forms yet. Start creating to see them here.
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-transform"
            >
              Create your first form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form._id}
                className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/25 hover:-translate-y-1 hover:border-primary/40 transition-all cursor-pointer group backdrop-blur-xl"
                onClick={() => router.push(`/dashboard/forms/${form._id}`)}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_40%)]" />
                <div className="relative flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{form.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-semibold border border-white/10">
                        {form.type}
                      </span>
                    </div>
                    {form.description && (
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 size={14} />
                      <span>{responseCounts[form._id] || 0} responses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{formatDate(form.updatedAt || form.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/forms/${form._id}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm font-semibold"
                  >
                    <Eye size={14} className="inline mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
