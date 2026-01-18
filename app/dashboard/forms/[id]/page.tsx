"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { Form, Question } from "@/lib/types";
import {
  ArrowLeft,
  BarChart3,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Star,
  Share2,
  Copy,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"overview" | "responses">(
    "overview"
  );
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"link" | "embed" | null>(null);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateQuestionStats = (questionId: number) => {
    const question = form?.questions.find((q) => q.id === questionId);
    if (!question) return null;

    if (question.type === "multiple_choice" && question.options) {
      const stats: Record<number, number> = {};
      question.options.forEach((_, idx) => {
        stats[idx] = 0;
      });

      responses.forEach((response) => {
        const answer = response.answers[questionId];
        if (typeof answer === "number" && stats[answer] !== undefined) {
          stats[answer]++;
        }
      });

      return stats;
    }

    if (question.type === "rating") {
      const ratings: number[] = [];
      responses.forEach((response) => {
        const answer = response.answers[questionId];
        if (typeof answer === "number") {
          ratings.push(answer);
        }
      });
      const avg =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : "0.00";
      return { average: parseFloat(avg), total: ratings.length };
    }

    return null;
  };

  const getAverageScore = () => {
    if (form?.type !== "quiz" || responses.length === 0) return null;
    const scores = responses.map((r) => r.score || 0);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg.toFixed(1);
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

  const avgScore = getAverageScore();
  const publicLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/take/${formId}`
      : "";
  const embedCode = `<iframe src="${publicLink}" width="100%" height="600" frameborder="0" style="border:0;"></iframe>`;

  return (
    <div className="min-h-screen bg-slate-950 text-foreground relative overflow-hidden">
      <Navbar />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-6 w-80 h-80 rounded-full blur-3xl opacity-30 bg-primary" />
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full blur-[120px] opacity-25 bg-cyan-300" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_40%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto pt-28 px-6 pb-16 space-y-8">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-7 shadow-2xl shadow-black/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-[-5deg] button-press"
          >
            <ArrowLeft size={20} className="transition-transform duration-300 hover:-translate-x-1" />
          </button>
          <div className="flex-1 space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              Analytics
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-slate-300 mt-1">{form.description}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 bg-white/5 text-white button-press ripple"
            >
              <Share2 size={16} className="transition-transform duration-300 hover:rotate-12" />
              Share
            </button>
            <button
              onClick={exportToCSV}
              disabled={responses.length === 0}
              className="px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-white/5 text-white button-press ripple"
            >
              <Download size={16} className="transition-transform duration-300 hover:translate-y-[-2px]" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20 backdrop-blur-xl hover-lift animate-fade-in transition-all duration-300 hover:border-emerald-400/50">
            <div className="flex items-center gap-3 mb-2 text-slate-300">
              <FileText size={20} className="text-emerald-400 transition-all duration-300 hover:scale-110 hover:rotate-3" />
              <span className="text-sm transition-all duration-300 hover:translate-x-1">Total Responses</span>
            </div>
            <p className="text-3xl font-semibold text-white transition-all duration-300 hover:scale-110">{responses.length}</p>
          </div>
          {form.type === "quiz" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20 backdrop-blur-xl hover-lift animate-fade-in transition-all duration-300 hover:border-cyan-400/50" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-2 text-slate-300">
                <BarChart3 size={20} className="text-cyan-300 transition-all duration-300 hover:scale-110 hover:rotate-3" />
                <span className="text-sm transition-all duration-300 hover:translate-x-1">Average Score</span>
              </div>
              <p className="text-3xl font-semibold text-white transition-all duration-300 hover:scale-110">
                {avgScore !== null
                  ? `${avgScore}/${form.questions.length}`
                  : "N/A"}
              </p>
            </div>
          )}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20 backdrop-blur-xl hover-lift animate-fade-in transition-all duration-300 hover:border-amber-400/50" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2 text-slate-300">
              <CheckCircle2 size={20} className="text-amber-300 transition-all duration-300 hover:scale-110 hover:rotate-3" />
              <span className="text-sm transition-all duration-300 hover:translate-x-1">Questions</span>
            </div>
            <p className="text-3xl font-semibold text-white transition-all duration-300 hover:scale-110">{form.questions.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 w-fit backdrop-blur">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 button-press ${activeTab === "overview"
                ? "bg-white text-slate-900 shadow-md scale-105"
                : "text-slate-200 hover:bg-white/5 hover:scale-105"
              }`}
          >
            Question Analytics
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 button-press ${activeTab === "responses"
                ? "bg-white text-slate-900 shadow-md scale-105"
                : "text-slate-200 hover:bg-white/5 hover:scale-105"
              }`}
          >
            All Responses ({responses.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "overview" ? (
          <div className="space-y-6">
            {form.questions.map((question, qIdx) => {
              const stats = calculateQuestionStats(question.id);
              return (
                <div
                  key={question.id}
                  className="bg-card border border-white/5 rounded-2xl p-6 hover-lift animate-fade-in transition-all duration-300 hover:border-white/10"
                  style={{ animationDelay: `${qIdx * 50}ms` }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                      {qIdx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {question.text}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                        {question.type}
                      </span>
                    </div>
                  </div>

                  {question.type === "multiple_choice" &&
                    question.options &&
                    stats && (
                      <div className="space-y-3 mt-4">
                        {question.options.map((option, optIdx) => {
                          const count =
                            (stats as Record<number, number>)[optIdx] || 0;
                          const percentage =
                            responses.length > 0
                              ? ((count / responses.length) * 100).toFixed(1)
                              : 0;
                          const isCorrect = question.correctAnswer === optIdx;

                          return (
                            <div key={optIdx} className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{option}</span>
                                  {form.type === "quiz" && isCorrect && (
                                    <CheckCircle2
                                      size={14}
                                      className="text-green-500"
                                    />
                                  )}
                                </div>
                                <span className="text-muted-foreground">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${isCorrect && form.type === "quiz"
                                      ? "bg-green-500/60"
                                      : "bg-primary/60"
                                    }`}
                                  style={{ 
                                    width: `${percentage}%`,
                                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  {question.type === "rating" &&
                    stats &&
                    "average" in stats && (
                      <div className="mt-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-2xl font-semibold">
                              {stats.average}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Average rating
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star
                                key={rating}
                                size={24}
                                className={
                                  rating <= Math.round(stats.average)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-white/10"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  {question.type === "text" && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {responses.filter((r) => r.answers[question.id]).length}{" "}
                        text responses collected
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {responses.length === 0 ? (
              <div className="bg-card border border-white/5 rounded-2xl p-12 text-center">
                <FileText
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground/50"
                />
                <p className="text-muted-foreground">No responses yet</p>
              </div>
            ) : (
              responses.map((response, idx) => (
                <div
                  key={response._id}
                  className="bg-card border border-white/5 rounded-2xl p-6 hover-lift animate-fade-in transition-all duration-300 hover:border-white/10"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <div>
                      <p className="font-semibold">Response #{idx + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(response.submittedAt)}
                      </p>
                    </div>
                    {form.type === "quiz" && (
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-primary">
                          {response.score || 0}/{form.questions.length}
                        </p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {form.questions.map((question) => {
                      const answer = response.answers[question.id];
                      return (
                        <div key={question.id}>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {question.text}
                          </p>
                          <div className="text-foreground">
                            {question.type === "multiple_choice" &&
                              question.options &&
                              typeof answer === "number" && (
                                <div className="flex items-center gap-2">
                                  <span>{question.options[answer]}</span>
                                  {form.type === "quiz" &&
                                    question.correctAnswer !== undefined &&
                                    (question.correctAnswer === answer ? (
                                      <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                      />
                                    ) : (
                                      <XCircle
                                        size={16}
                                        className="text-red-500"
                                      />
                                    ))}
                                </div>
                              )}
                            {question.type === "text" && (
                              <p className="text-sm bg-white/5 p-3 rounded-lg">
                                {answer || "No answer"}
                              </p>
                            )}
                            {question.type === "rating" &&
                              typeof answer === "number" && (
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <Star
                                      key={rating}
                                      size={20}
                                      className={
                                        rating <= answer
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-white/10"
                                      }
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    ({answer}/5)
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsShareOpen(false)} />
          <div className="relative max-w-lg w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-6 space-y-5 animate-scale-in hover-lift">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Share form</h2>
                <p className="text-xs text-slate-400 mt-1">Copy the link, embed on your site, or share via QR code.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-300 transition-all duration-300 hover:scale-110 hover:rotate-90 button-press"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Public link */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Public link</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={publicLink}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-100 overflow-x-auto"
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
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-1 transition-all duration-300 hover:scale-105 button-press"
                >
                  <Copy size={14} className="transition-transform duration-300" />
                  {copiedField === "link" ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>

            {/* Embed code */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Embed code</label>
              <div className="flex gap-2">
                <textarea
                  readOnly
                  rows={3}
                  value={embedCode}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-100 font-mono"
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
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-1 self-start transition-all duration-300 hover:scale-105 button-press"
                >
                  <Copy size={14} className="transition-transform duration-300" />
                  {copiedField === "embed" ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>

            {/* QR code */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">QR code</label>
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    publicLink
                  )}`}
                  alt="Form QR code"
                  className="w-32 h-32 rounded-md border border-white/10 bg-white"
                />
                <p className="text-xs text-slate-400">
                  Scan this code to open the public form on mobile, or download the image for your docs and slides.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
