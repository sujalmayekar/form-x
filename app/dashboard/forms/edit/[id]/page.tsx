'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FormBuilder from '@/components/FormBuilder';
import { Form } from '@/lib/types';

export default function EditFormPage() {
    const params = useParams();
    const router = useRouter();
    const [form, setForm] = useState<Form | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchForm();
        }
    }, [params.id]);

    const fetchForm = async () => {
        try {
            const res = await fetch(`/api/forms/${params.id}`);
            const data = await res.json();
            if (data.success) {
                // Ensure questions have IDs if missing (migration)
                const processedForm = {
                    ...data.form,
                    id: data.form._id, // Map _id to id for FormBuilder
                    questions: data.form.questions.map((q: any) => ({
                        ...q,
                        id: q.id || Date.now() + Math.random()
                    }))
                };
                setForm(processedForm);
            } else {
                alert('Form not found');
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error fetching form:', error);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-pulse">Loading form...</div>
            </div>
        );
    }

    if (!form) return null;

    return (
        <FormBuilder
            form={form}
            setForm={setForm as any}
            onPreview={() => {
                const win = window.open(`/take/${params.id}`, '_blank');
                win?.focus();
            }}
            onExit={() => router.push('/dashboard')}
        />
    );
}
