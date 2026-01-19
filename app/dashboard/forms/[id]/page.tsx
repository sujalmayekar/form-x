"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { Form } from "@/lib/types";
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 hover-lift animate-fade-in transition-all duration-300 hover:border-white/10 group">
            <div className="flex items-center gap-3 mb-2 text-zinc-400">
              <FileText size={16} className="text-emerald-500/80 transition-all duration-300 group-hover:text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-wider">Total Responses</span>
            </div>
            <p className="text-3xl font-serif text-white">{responses.length}</p>
          </div>
          {form.type === "quiz" && (
            <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 hover-lift animate-fade-in transition-all duration-300 hover:border-white/10 group" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-2 text-zinc-400">
                <BarChart3 size={16} className="text-cyan-500/80 transition-all duration-300 group-hover:text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider">Average Score</span>
              </div>
              <p className="text-3xl font-serif text-white">
                {avgScore !== null
                  ? `${avgScore}/${form.questions.length}`
                  : "N/A"}
              </p>
            </div>
          )}
          <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 hover-lift animate-fade-in transition-all duration-300 hover:border-white/10 group" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2 text-zinc-400">
              <CheckCircle2 size={16} className="text-amber-500/80 transition-all duration-300 group-hover:text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-wider">Questions</span>
            </div>
            <p className="text-3xl font-serif text-white">{form.questions.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/5 pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === "overview"
              ? "border-white text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            Question Analytics
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === "responses"
              ? "border-white text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            All Responses <span className="text-zinc-600 ml-1">({responses.length})</span>
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
                  className="bg-zinc-900/20 border border-white/5 rounded-lg p-6 hover-lift animate-fade-in transition-all duration-300"
                  style={{ animationDelay: `${qIdx * 50}ms` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-zinc-800 text-zinc-400 font-mono text-xs">
                      {qIdx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-zinc-200">
                        {question.text}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                        {question.type}
                      </span>
                    </div>
                  </div>

                  {question.type === "multiple_choice" &&
                    question.options &&
                    stats && (
                      <div className="space-y-3">
                        {question.options.map((option, optIdx) => {
                          const count =
                            (stats as Record<number, number>)[optIdx] || 0;
                          const percentage =
                            responses.length > 0
                              ? ((count / responses.length) * 100).toFixed(1)
                              : 0;
                          const isCorrect = question.correctAnswer === optIdx;

                          return (
                            <div key={optIdx} className="group space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-zinc-300">
                                  <span>{option}</span>
                                  {form.type === "quiz" && isCorrect && (
                                    <CheckCircle2
                                      size={14}
                                      className="text-emerald-500"
                                    />
                                  )}
                                </div>
                                <span className="text-zinc-500 font-mono text-xs">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${isCorrect && form.type === "quiz"
                                    ? "bg-emerald-500/50"
                                    : "bg-zinc-200/50 group-hover:bg-zinc-200"
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
                            <p className="text-2xl font-serif text-white">
                              {stats.average}
                            </p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">
                              Average
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star
                                key={rating}
                                size={20}
                                className={
                                  rating <= Math.round(stats.average)
                                    ? "text-yellow-500/80 fill-yellow-500/80"
                                    : "text-zinc-800"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  {question.type === "text" && (
                    <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-md">
                      <p className="text-xs text-zinc-500 font-mono">
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
              <div className="border border-dashed border-zinc-800 rounded-lg p-12 text-center bg-zinc-900/20">
                <FileText
                  size={32}
                  className="mx-auto mb-4 text-zinc-700"
                />
                <p className="text-zinc-500">No responses yet</p>
              </div>
            ) : (
              responses.map((response, idx) => (
                <div
                  key={response._id}
                  className="bg-zinc-900/20 border border-white/5 rounded-lg p-6 hover-lift animate-fade-in transition-all duration-300"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <div>
                      <p className="font-medium text-zinc-200">Response #{idx + 1}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-1">
                        {formatDate(response.submittedAt)}
                      </p>
                    </div>
                    {form.type === "quiz" && (
                      <div className="text-right">
                        <p className="text-xl font-serif text-white">
                          {response.score || 0}/{form.questions.length}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Score</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {form.questions.map((question) => {
                      const answer = response.answers[question.id];
                      return (
                        <div key={question.id}>
                          <p className="text-sm text-zinc-400 mb-2">
                            {question.text}
                          </p>
                          <div className="text-zinc-200">
                            {question.type === "multiple_choice" &&
                              question.options &&
                              typeof answer === "number" && (
                                <div className="flex items-center gap-2">
                                  <span className="bg-zinc-800 px-2 py-1 rounded text-sm">{question.options[answer]}</span>
                                  {form.type === "quiz" &&
                                    question.correctAnswer !== undefined &&
                                    (question.correctAnswer === answer ? (
                                      <CheckCircle2
                                        size={14}
                                        className="text-emerald-500"
                                      />
                                    ) : (
                                      <XCircle
                                        size={14}
                                        className="text-red-500"
                                      />
                                    ))}
                                </div>
                              )}
                            {question.type === "text" && (
                              <p className="text-sm bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-300 font-mono">
                                {answer || "No answer"}
                              </p>
                            )}
                            {question.type === "rating" &&
                              typeof answer === "number" && (
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <Star
                                      key={rating}
                                      size={16}
                                      className={
                                        rating <= answer
                                          ? "text-yellow-500/80 fill-yellow-500/80"
                                          : "text-zinc-800"
                                      }
                                    />
                                  ))}
                                  <span className="ml-2 text-xs text-zinc-500 font-mono">
                                    ({answer}/5)
                                  </span>
                                </div>
                              )}
                            {/* Fallback for other types or null answers */}
                            {!['multiple_choice', 'text', 'rating'].includes(question.type) && answer && (
                              <p className="text-sm text-zinc-300">{String(answer)}</p>
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsShareOpen(false)} />
          <div className="relative max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl shadow-black/40 p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-white">Share form</h2>
                <p className="text-sm text-zinc-500 mt-1">Copy the link or embed code.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 transition-all duration-300"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Public link */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Public link</label>
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
