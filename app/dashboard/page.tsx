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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-28 px-6 pb-16 space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Your Forms
            </h1>
            <p className="text-muted-foreground mt-2">
              Create, organize, and analyse forms in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-white/5 transition"
            >
              + Create New Form
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Loading your forms...</div>
          </div>
        ) : forms.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-card/50">
            <FileText size={48} className="text-muted-foreground/50" />
            <p className="text-muted-foreground text-center">
              No forms yet. Start creating to see them here.
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition"
            >
              Create your first form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form._id}
                className="bg-card border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20 hover:-translate-y-1 hover:border-primary/40 transition-all cursor-pointer group"
                onClick={() => router.push(`/dashboard/forms/${form._id}`)}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{form.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {form.type}
                      </span>
                    </div>
                    {form.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium"
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
