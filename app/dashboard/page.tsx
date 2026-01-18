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
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <div className="fixed inset-0 pointer-events-none z-0 technical-grid" />
      <Navbar />

      <div className="relative z-10 max-w-[1400px] mx-auto pt-32 px-6 pb-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-zinc-400 max-w-xl font-light">
              Manage your deployments, analyze responses, and configure form endpoints.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all duration-300 hover:scale-105 hover:shadow-lg button-press ripple"
          >
            + New Form
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-48 rounded-lg bg-zinc-900/50 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="border border-dashed border-zinc-800 rounded-lg p-20 flex flex-col items-center justify-center gap-6 bg-zinc-900/20">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <FileText size={20} className="text-zinc-500" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-zinc-300 font-medium">No forms created yet</p>
              <p className="text-zinc-500 text-sm">Start by creating your first quiz or survey.</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-md border border-zinc-700 text-zinc-300 text-sm hover:text-white hover:border-zinc-500 transition-all duration-300 hover:scale-105 hover:shadow-lg button-press ripple"
            >
              Create Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {forms.map((form, index) => (
              <div
                key={form._id}
                className="group relative bg-zinc-900/40 border border-white/5 rounded-lg p-6 hover:border-white/10 transition-all duration-300 cursor-pointer hover-lift animate-fade-in"
                onClick={() => router.push(`/dashboard/forms/${form._id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="font-medium text-white group-hover:text-white transition-colors">{form.title}</h3>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{form.type}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${responseCounts[form._id] ? 'bg-emerald-500 animate-pulse-subtle' : 'bg-zinc-700'} group-hover:scale-150`} />
                </div>

                {form.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-6 h-10">
                    {form.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-zinc-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 size={12} />
                      <span>{responseCounts[form._id] || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{formatDate(form.updatedAt || form.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-white hover:underline hover:translate-x-1 button-press"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/forms/${form._id}`);
                    }}
                  >
                    Manage →
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
