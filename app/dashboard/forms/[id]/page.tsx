"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";

interface Question {
  id: number;
  text: string;
  type: "multiple_choice" | "text" | "rating";
  options?: string[];
  correctAnswer?: number;
}

interface Form {
  _id: string;
  title: string;
  description?: string;
  type: "quiz" | "survey";
  questions: Question[];
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

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "responses">(
    "overview"
  );

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

  const exportToCSV = () => {
    if (!form || responses.length === 0) return;

    const headers = [
      "Response ID",
      "Submitted At",
      ...form.questions.map((q) => q.text),
      ...(form.type === "quiz" ? ["Score"] : []),
    ];
    const rows = responses.map((response, idx) => {
      const row = [
        `Response ${idx + 1}`,
        formatDate(response.submittedAt),
        ...form.questions.map((q) => {
          const answer = response.answers[q.id];
          if (
            q.type === "multiple_choice" &&
            typeof answer === "number" &&
            q.options
          ) {
            return q.options[answer] || "";
          }
          if (q.type === "rating") {
            return typeof answer === "number" ? answer.toString() : "";
          }
          return typeof answer === "string" ? answer : "";
        }),
        ...(form.type === "quiz" ? [response.score?.toString() || "0"] : []),
      ];
      return row.map((cell) => `"${cell}"`).join(",");
    });

    const csv = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/\s+/g, "_")}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-28 px-6 pb-16 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg hover:bg-white/5 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-muted-foreground mt-2">{form.description}</p>
            )}
          </div>
          <button
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                Total Responses
              </span>
            </div>
            <p className="text-3xl font-semibold">{responses.length}</p>
          </div>
          {form.type === "quiz" && (
            <div className="bg-card border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 size={20} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Average Score
                </span>
              </div>
              <p className="text-3xl font-semibold">
                {avgScore !== null
                  ? `${avgScore}/${form.questions.length}`
                  : "N/A"}
              </p>
            </div>
          )}
          <div className="bg-card border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 size={20} className="text-primary" />
              <span className="text-sm text-muted-foreground">Questions</span>
            </div>
            <p className="text-3xl font-semibold">{form.questions.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "overview"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Question Analytics
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "responses"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
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
                  className="bg-card border border-white/5 rounded-2xl p-6"
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
                                  className={`h-full rounded-full transition-all ${
                                    isCorrect && form.type === "quiz"
                                      ? "bg-green-500/60"
                                      : "bg-primary/60"
                                  }`}
                                  style={{ width: `${percentage}%` }}
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
                  className="bg-card border border-white/5 rounded-2xl p-6"
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
    </div>
  );
}
