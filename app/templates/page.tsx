'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { templates } from '@/lib/templates';

export default function TemplatesPage() {
    const router = useRouter();
    const { user } = useUser();
    const [creatingId, setCreatingId] = useState<string | null>(null);

    const handleCreateTemplate = async (template: typeof templates[0]) => {
        setCreatingId(template.id);

        if (template.type === 'invoice') {
            setTimeout(() => {
                router.push(`/?view=invoice-builder&template=${template.id}`);
            }, 500);
            return;
        }

        // For forms, redirect to builder with template ID to populate state without saving yet
        setTimeout(() => {
            router.push(`/?view=builder&templateId=${template.id}`);
        }, 500);
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
                                            <span>Loading...</span>
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
