"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { Form } from "@/lib/types";
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  XCircle,
  BarChart3, // Used in icon
} from "lucide-react";
import AnalyticsView from "@/components/AnalyticsView";

interface ApiForm extends Form {
  _id: string;
}

interface Response {
  _id: string;
  answers: Record<number, any>;
  score?: number;
  submittedAt: string;
}

export default function FormAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<ApiForm | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"link" | "embed" | "analytics" | null>(null);

  useEffect(() => {
    if (formId) {
      fetchData();
    }
  }, [formId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}/responses`);
      const data = await res.json();
      if (data.success) {
        setForm(data.form);
        setResponses(data.responses || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    if (!form) return;

    try {
      // Fetch fresh responses to ensure latest data
      const res = await fetch(`/api/forms/${form._id}/responses`);
      const data = await res.json();
      if (!data.success || !data.responses || data.responses.length === 0) return;

      const freshResponses: Response[] = data.responses;

      const headers = form.questions.map((q) => q.text || `Question ${q.id}`);

      const rows = freshResponses.map((response) => {
        return form.questions.map((q) => {
          const answer = response.answers[q.id];
          if (
            q.type === "multiple_choice" &&
            typeof answer === "number" &&
            q.options
          ) {
            return q.options[answer] || "";
          }
          if (q.type === "rating" || q.type === "date") {
            return answer !== undefined && answer !== null ? String(answer) : "";
          }
          if (Array.isArray(answer)) {
            return answer.join(", ");
          }
          // text / long_text / other strings
          return typeof answer === "string" ? answer : "";
        });
      });

      const escapeCell = (cell: string) =>
        `"${(cell ?? "").replace(/"/g, '""')}"`;

      const csv = [
        headers.map(escapeCell).join(","),
        ...rows.map((row) => row.map(escapeCell).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.title.replace(/\s+/g, "_")}_responses.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error exporting CSV", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-28 px-6 pb-16">
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-28 px-6 pb-16">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Form not found</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const publicLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/take/${formId}`
      : "";

  const analyticsLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/analytics/${formId}`
      : "";

  const embedCode = `<iframe src="${publicLink}" width="100%" height="600" frameborder="0" style="border:0;"></iframe>`;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none z-0 technical-grid" />

      <div className="relative z-10 max-w-7xl mx-auto pt-28 px-6 pb-16 space-y-8">
        {/* Header */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 md:p-7 backdrop-blur-xl flex flex-col md:flex-row md:items-center md:gap-6 gap-4 animate-fade-in">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-md bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/10 transition-all duration-300 button-press"
          >
            <ArrowLeft size={18} className="text-zinc-400" />
          </button>
          <div className="flex-1 space-y-1">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-zinc-800/50 border border-zinc-700 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Analytics
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight text-white">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-zinc-400 mt-1 max-w-2xl">{form.description}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-500 text-sm font-medium hover:bg-zinc-800 transition-all duration-300 flex items-center gap-2 bg-zinc-900 text-zinc-200 button-press ripple"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={exportToCSV}
              disabled={responses.length === 0}
              className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-500 text-sm font-medium hover:bg-zinc-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-zinc-900 text-zinc-200 button-press ripple"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Analytics View */}
        <AnalyticsView form={form} responses={responses} />

      </div>

      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsShareOpen(false)} />
          <div className="relative max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl shadow-black/40 p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-white">Share options</h2>
                <p className="text-sm text-zinc-500 mt-1">Share the form or its analytics.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 transition-all duration-300"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Public Form link */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Public Form Link</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={publicLink}
                  className="flex-1 px-3 py-2 rounded bg-black border border-zinc-800 text-xs text-zinc-300 font-mono"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(publicLink);
                      setCopiedField("link");
                      setTimeout(() => setCopiedField(null), 1500);
                    } catch (e) {
                      console.error("Copy failed", e);
                    }
                  }}
                  className="px-3 py-2 rounded bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-all duration-300 flex items-center gap-1"
                >
                  <Copy size={12} />
                  {copiedField === "link" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Public Analytics link */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-cyan-500" />
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Public Analytics Link</label>
              </div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={analyticsLink}
                  className="flex-1 px-3 py-2 rounded bg-black border border-zinc-800 text-xs text-zinc-300 font-mono text-cyan-500/80"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(analyticsLink);
                      setCopiedField("analytics");
                      setTimeout(() => setCopiedField(null), 1500);
                    } catch (e) {
                      console.error("Copy failed", e);
                    }
                  }}
                  className="px-3 py-2 rounded bg-zinc-800 border-zinc-700 text-white text-xs font-medium hover:bg-zinc-700 transition-all duration-300 flex items-center gap-1"
                >
                  <Copy size={12} />
                  {copiedField === "analytics" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Embed code */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Embed code</label>
              <div className="flex gap-2">
                <textarea
                  readOnly
                  rows={3}
                  value={embedCode}
                  className="flex-1 px-3 py-2 rounded bg-black border border-zinc-800 text-xs text-zinc-300 font-mono resize-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(embedCode);
                      setCopiedField("embed");
                      setTimeout(() => setCopiedField(null), 1500);
                    } catch (e) {
                      console.error("Copy failed", e);
                    }
                  }}
                  className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white text-xs font-medium hover:bg-zinc-700 h-fit transition-all duration-300 flex items-center gap-1"
                >
                  <Copy size={12} />
                  {copiedField === "embed" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* QR code */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">QR CODE</label>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      publicLink
                    )}`}
                    alt="Form QR code"
                    className="w-24 h-24"
                  />
                </div>
                <p className="text-xs text-zinc-500 max-w-[200px]">
                  Scan for mobile access.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
