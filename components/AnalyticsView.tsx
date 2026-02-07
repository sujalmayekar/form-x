"use client";

import React, { useState } from "react";
import { Form } from "@/lib/types";
import {
    BarChart3,
    FileText,
    CheckCircle2,
    XCircle,
    Star,
    PieChart as PieChartIcon,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Response {
    _id: string;
    answers: Record<number, any>;
    score?: number;
    submittedAt: string;
}

interface AnalyticsViewProps {
    form: Form & { _id?: string };
    responses: Response[];
    isPublic?: boolean;
}

const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#f43f5e", "#6366f1", "#8b5cf6", "#ec4899"];

export default function AnalyticsView({ form, responses, isPublic = false }: AnalyticsViewProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "responses">("overview");

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

                // Handle array of strings (multi-select)
                if (Array.isArray(answer)) {
                    answer.forEach((ans) => {
                        if (typeof ans === 'string') {
                            const idx = question.options!.indexOf(ans);
                            if (idx !== -1) stats[idx]++;
                        }
                    });
                }
                // Handle single string answer
                else if (typeof answer === 'string') {
                    const idx = question.options!.indexOf(answer);
                    if (idx !== -1) stats[idx]++;
                }
                // Handle legacy number index
                else if (typeof answer === "number" && stats[answer] !== undefined) {
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

            // Count frequency for bar chart
            const distribution = [0, 0, 0, 0, 0]; // 1 to 5
            ratings.forEach(r => {
                if (r >= 1 && r <= 5) distribution[r - 1]++;
            });

            return { average: parseFloat(avg), total: ratings.length, distribution };
        }

        return null;
    };

    const getAverageScore = () => {
        if (form?.type !== "quiz" || responses.length === 0) return null;
        const scores = responses.map((r) => r.score || 0);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg.toFixed(1);
    };

    const avgScore = getAverageScore();

    return (
        <div className="space-y-8">
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
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="space-y-3 flex-1">
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
                                                                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                        backgroundColor: COLORS[optIdx % COLORS.length]
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {/* Pie Chart for Multiple Choice */}
                                            <div className="h-48 w-full md:w-64 flex-shrink-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={question.options.map((opt, i) => ({
                                                                name: opt,
                                                                value: (stats as Record<number, number>)[i] || 0
                                                            })).filter(d => d.value > 0)}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={40}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {question.options.map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#e4e4e7', fontSize: '12px' }}
                                                            itemStyle={{ color: '#e4e4e7' }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                {question.type === "rating" &&
                                    stats &&
                                    "average" in stats && (
                                        <div className="mt-4 flex flex-col md:flex-row gap-8 items-center">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-4xl font-serif text-white">
                                                            {stats.average}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                                                            Average Rating
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((rating) => (
                                                            <Star
                                                                key={rating}
                                                                size={24}
                                                                className={
                                                                    rating <= Math.round(Number(stats.average))
                                                                        ? "text-yellow-500/80 fill-yellow-500/80"
                                                                        : "text-zinc-800"
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-zinc-500 font-mono mt-4">
                                                    Based on {stats.total} responses
                                                </p>
                                            </div>

                                            {/* Bar Chart for Ratings */}
                                            <div className="h-40 w-full flex-1">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={[1, 2, 3, 4, 5].map(r => ({
                                                        name: `${r} Stars`,
                                                        count: (stats as any).distribution[r - 1] || 0
                                                    }))}>
                                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                                                        <Tooltip
                                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#e4e4e7', fontSize: '12px' }}
                                                        />
                                                        <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
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

                                {/* Date visualization fallback */}
                                {question.type === "date" && (
                                    <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-md">
                                        <p className="text-xs text-zinc-500 font-mono">
                                            {responses.filter((r) => r.answers[question.id]).length} date responses
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
                                                        (
                                                            <div className="flex flex-wrap gap-2">
                                                                {/* Handle Array (Multi-select) */}
                                                                {Array.isArray(answer) ? (
                                                                    answer.map((ans: string, i: number) => (
                                                                        <span key={i} className="bg-zinc-800 px-2 py-1 rounded text-sm text-zinc-300 border border-zinc-700">
                                                                            {ans}
                                                                        </span>
                                                                    ))
                                                                ) : typeof answer === 'string' ? (
                                                                    // Handle String (Single select)
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-zinc-800 px-2 py-1 rounded text-sm text-zinc-300 border border-zinc-700">
                                                                            {answer}
                                                                        </span>
                                                                        {form.type === "quiz" &&
                                                                            question.correctAnswer != null &&
                                                                            (question.options[question.correctAnswer] === answer ? (
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
                                                                ) : typeof answer === 'number' ? (
                                                                    // Handle Legacy Number
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-zinc-800 px-2 py-1 rounded text-sm text-zinc-300 border border-zinc-700">
                                                                            {question.options[answer]}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-zinc-500 italic text-sm">No valid answer</span>
                                                                )}
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
    );
}
