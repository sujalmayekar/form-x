'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Layout, ArrowRight, BookOpen, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const templates = [
    {
        id: 'exam',
        title: 'Semester End Examination',
        description: 'Standard academic assessment template with student details and batch selection.',
        type: 'quiz',
        icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
        gradient: 'from-emerald-900/20 to-zinc-900',
        questions: [
            { text: "Full Name", type: "text", required: true },
            { text: "Roll Number", type: "text", required: true },
            { text: "Batch Code", type: "multiple_choice", options: ["Batch A", "Batch B", "Batch C"], required: true },
            { text: "Student Email", type: "text", required: true }
        ]
    },
    {
        id: 'event',
        title: 'Tech Summit 2026 Registration',
        description: 'Professional event RSVP form with attendance options and dietary preferences.',
        type: 'survey',
        icon: <Calendar className="w-6 h-6 text-amber-400" />,
        gradient: 'from-amber-900/20 to-zinc-900',
        questions: [
            { text: "Full Name", type: "text", required: true },
            { text: "Work Email", type: "text", required: true },
            { text: "Will you be attending?", type: "multiple_choice", options: ["Yes, in-person", "Yes, virtually", "No"], required: true },
            { text: "Dietary Restrictions", type: "long_text", required: false }
        ]
    },
    {
        id: 'feedback',
        title: 'User Experience Survey',
        description: 'Collect detailed product feedback and user satisfaction ratings.',
        type: 'survey',
        icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
        gradient: 'from-blue-900/20 to-zinc-900',
        questions: [
            { text: "How would you rate your experience?", type: "rating", maxRating: 5, required: true },
            { text: "What feature do you use the most?", type: "text", required: true },
            { text: "How can we improve?", type: "long_text", required: true },
            { text: "Can we contact you for follow-up?", type: "multiple_choice", options: ["Yes", "No"], required: true }
        ]
    }
];

export default function TemplatesPage() {
    const router = useRouter();
    const { user } = useUser();
    const [creatingId, setCreatingId] = useState<string | null>(null);

    const handleCreateTemplate = async (template: typeof templates[0]) => {


        setCreatingId(template.id);

        try {
            // Process questions to match expected format with unique IDs
            const processedQuestions = template.questions.map((q, index) => ({
                id: Date.now() + index,
                ...q
            }));

            const res = await fetch('/api/forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: template.title,
                    description: template.description,
                    type: template.type,
                    questions: processedQuestions,
                    theme: {
                        primaryColor: "#fafafa",
                        backgroundColor: "#09090b",
                        cardBackground: "#18181b",
                        textColor: "#f4f4f5",
                        borderColor: "#27272a",
                        borderRadius: "lg",
                        headerStyle: "default"
                    }
                }),
            });

            const data = await res.json();
            if (data.success) {
                // Add artificial delay for smoother UX
                setTimeout(() => {
                    router.push(`/dashboard/forms/${data.id}?edit=true`);
                }, 500);
            } else {
                alert('Failed to create template');
                setCreatingId(null);
            }
        } catch (error) {
            console.error(error);
            alert('Error creating form');
            setCreatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-white/20">
            <div className="fixed inset-0 pointer-events-none z-0 technical-grid" />
            <Navbar />

            <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                <div className="max-w-4xl mx-auto mb-16 text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight animate-slide-up">
                        Start with a <span className="text-zinc-400">Blueprint.</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Choose a pre-engineered template to jumpstart your data collection.
                        Fully customizable and production-ready.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template, index) => (
                        <div
                            key={template.id}
                            onClick={() => !creatingId && handleCreateTemplate(template)}
                            className={`group relative glass-card p-8 rounded-xl cursor-pointer overflow-hidden hover-lift animate-fade-in ${creatingId && creatingId !== template.id ? 'opacity-50' : 'opacity-100'}`}
                            style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                        >
                            {/* Gradient Blob Background */}
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${template.gradient} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors shadow-lg">
                                        {template.icon}
                                    </div>
                                    <div className="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-white/5 bg-white/5 text-zinc-500">
                                        {template.type}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{template.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                                    {template.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-white transition-colors pt-4 border-t border-white/5">
                                    {creatingId === template.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Use Template</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
