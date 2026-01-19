import React from 'react';
import { Layout, BookOpen, Calendar, MessageSquare } from 'lucide-react';

export const templates = [
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
        id: 'modern',
        title: 'Modern Invoice',
        description: 'Clean and professional invoice design perfect for any business.',
        type: 'invoice',
        icon: <Layout className="w-6 h-6 text-indigo-400" />,
        gradient: 'from-indigo-900/20 to-zinc-900',
        questions: []
    },
    {
        id: 'dark',
        title: 'Dark Mode Invoice',
        description: 'Sleek, high-contrast dark theme for digital agencies and tech firms.',
        type: 'invoice',
        icon: <Layout className="w-6 h-6 text-zinc-400" />,
        gradient: 'from-zinc-800/20 to-black',
        questions: []
    },
    {
        id: 'geometric',
        title: 'Geometric Creative',
        description: 'Bold geometric shapes and vibrant colors for creative professionals.',
        type: 'invoice',
        icon: <Layout className="w-6 h-6 text-pink-400" />,
        gradient: 'from-pink-900/20 to-teal-900/20',
        questions: []
    },
    {
        id: 'minimal',
        title: 'Minimalist Clean',
        description: 'Distraction-free layout focusing purely on the content.',
        type: 'invoice',
        icon: <Layout className="w-6 h-6 text-gray-400" />,
        gradient: 'from-gray-900/20 to-zinc-200/5',
        questions: []
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
] as const;
