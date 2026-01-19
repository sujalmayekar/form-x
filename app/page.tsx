'use client';

import React, { useState, useEffect, Suspense } from 'react';
import LandingScreen from '@/components/LandingScreen';
import FormBuilder from '@/components/FormBuilder';
import FormPreview from '@/components/FormPreview';
import InvoiceBuilder from '@/components/InvoiceBuilder';
import { Form, Question } from '@/lib/types'; // added Question
import { useSearchParams } from 'next/navigation';
import { templates } from '@/lib/templates';

function HomeContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<'landing' | 'builder' | 'preview' | 'invoice-builder'>('landing');

  // Initialize view and template from URL
  useEffect(() => {
    const viewParam = searchParams?.get('view');
    const templateId = searchParams?.get('templateId');

    if (viewParam === 'invoice-builder') {
      setView('invoice-builder');
    } else if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template && template.type !== 'invoice') {
        const processedQuestions: Question[] = template.questions.map((q, index) => ({
          id: Date.now() + index, // Assign valid unique ID

          ...q
        })) as Question[]; // Type cast to ensure compatibility

        setForm(prev => ({
          ...prev,
          title: template.title,
          description: template.description,
          type: template.type as 'quiz' | 'survey',
          questions: processedQuestions
        }));
        setView('builder');
      }
    }
  }, [searchParams]);

  const [form, setForm] = useState<Form>({
    title: '',
    description: '',
    type: 'quiz', // quiz or survey
    questions: [],
    isOpen: true,
    thankYouTitle: 'Submission received!',
    thankYouDescription: 'Thank you for completing this form.'
  });

  const handleCreate = (type: 'quiz' | 'survey' | 'invoice') => {
    if (type === 'invoice') {
      setView('invoice-builder');
      return;
    }
    // Correctly updating the state with a new object to ensure type safety if using TS
    setForm(prev => ({ ...prev, type, questions: [] }));
    setView('builder');
  };

  return (
    <main>
      {view === 'landing' && (
        <LandingScreen onCreate={(type) => handleCreate(type)} />
      )}

      {view === 'builder' && (
        <FormBuilder
          form={form}
          setForm={setForm}
          onPreview={() => setView('preview')}
          onExit={() => setView('landing')}
        />
      )}

      {view === 'preview' && (
        <FormPreview
          form={form}
          onBack={() => setView('builder')}
        />
      )}

      {view === 'invoice-builder' && (
        <InvoiceBuilder onBack={() => setView('landing')} />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
