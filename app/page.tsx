'use client';

import React, { useState } from 'react';
import LandingScreen from '@/components/LandingScreen';
import FormBuilder from '@/components/FormBuilder';
import FormPreview from '@/components/FormPreview';

export default function Home() {
  const [view, setView] = useState<'landing' | 'builder' | 'preview'>('landing');
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'quiz', // quiz or survey
    questions: []
  });

  const handleCreate = (type: string) => {
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
    </main>
  );
}