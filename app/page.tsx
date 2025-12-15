'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  Play, 
  ArrowLeft, 
  Save, 
  CheckSquare, 
  Type, 
  Star, 
  PieChart
} from 'lucide-react';

// --- Components ---

// 1. Landing Screen
const LandingScreen = ({ onCreate }: { onCreate: (type: string) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-6">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-4">FormCraft</h1>
      <p className="text-slate-600 text-lg">Select a mode to begin creating your form</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
      {/* Quiz Card */}
      <button 
        onClick={() => onCreate('quiz')}
        className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left border-2 border-transparent hover:border-indigo-500"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <CheckCircle size={100} className="text-indigo-600" />
        </div>
        <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
          <CheckSquare size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Scored Quiz</h2>
        <p className="text-slate-500">Create tests with automated scoring, correct answers, and pass/fail logic.</p>
      </button>

      {/* Survey Card */}
      <button 
        onClick={() => onCreate('survey')}
        className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left border-2 border-transparent hover:border-emerald-500"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <BarChart3 size={100} className="text-emerald-600" />
        </div>
        <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
          <PieChart size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Survey</h2>
        <p className="text-slate-500">Collect feedback, opinions, or data points with analytics and summary views.</p>
      </button>
    </div>
  </div>
);

// 2. Builder Interface
const Builder = ({ form, setForm, onPreview, onExit }: { form: any; setForm: (form: any) => void; onPreview: () => void; onExit: () => void }) => {
  const [isSaving, setIsSaving] = useState(false);

  // --- NEW: Function to Save to Database ---
  const saveForm = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Show the link to the user
        const link = `${window.location.origin}/take/${data.id}`;
        alert(`Form Saved Successfully!\n\nShare this link to let others take your quiz:\n${link}`);
      } else {
        alert('Error saving form: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while saving.');
    } finally {
      setIsSaving(false);
    }
  };
  // -----------------------------------------

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: Date.now(),
      type,
      text: '',
      required: true,
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2'] : [],
      correctAnswer: type === 'multiple_choice' ? 0 : null,
      maxRating: 5 
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setForm({
      ...form,
      questions: form.questions.map((q: any) => q.id === id ? { ...q, [field]: value } : q)
    });
  };

  const deleteQuestion = (id: number) => {
    setForm({
      ...form,
      questions: form.questions.filter((q: any) => q.id !== id)
    });
  };

  const addOption = (qId: number) => {
    setForm({
      ...form,
      questions: form.questions.map((q: any) => 
        q.id === qId ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] } : q
      )
    });
  };

  const updateOption = (qId: number, idx: number, value: string) => {
    setForm({
      ...form,
      questions: form.questions.map((q: any) => 
        q.id === qId ? { 
          ...q, 
          options: q.options.map((opt: string, i: number) => i === idx ? value : opt) 
        } : q
      )
    });
  };

  const removeOption = (qId: number, idx: number) => {
    setForm({
      ...form,
      questions: form.questions.map((q: any) => 
        q.id === qId ? { 
          ...q, 
          options: q.options.filter((_: string, i: number) => i !== idx),
          correctAnswer: q.correctAnswer === idx ? 0 : (q.correctAnswer > idx ? q.correctAnswer - 1 : q.correctAnswer)
        } : q
      )
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${form.type === 'quiz' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {form.type} Mode
            </span>
            <input 
              type="text" 
              value={form.title} 
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="text-lg font-bold text-slate-800 bg-transparent border-none focus:ring-0 placeholder-slate-400"
              placeholder="Untitled Form"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={onPreview} className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Play size={16} />
            <span>Preview</span>
          </button>
          
          {/* SAVE BUTTON */}
          <button 
            onClick={saveForm} 
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save & Share'}</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
        
        {/* Description Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-t-4 border-t-indigo-500">
          <input 
            type="text" 
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full text-slate-600 bg-transparent border-none focus:ring-0 p-0 placeholder-slate-400"
            placeholder="Form description"
          />
        </div>

        {/* Questions List */}
        {form.questions.map((q: any, index: number) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative group transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 mr-4">
                <input 
                  type="text" 
                  value={q.text} 
                  onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                  className="w-full font-medium text-lg border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 px-0 transition-colors bg-transparent placeholder-slate-400"
                  placeholder="Question text"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <select 
                  value={q.type}
                  onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                  className="text-sm border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="text">Short Answer</option>
                  <option value="rating">Rating</option>
                </select>
                <button onClick={() => deleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Question Type Specific Inputs */}
            {q.type === 'multiple_choice' && (
              <div className="space-y-3">
                {q.options.map((opt: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="relative">
                      {form.type === 'quiz' ? (
                        <input 
                          type="radio" 
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === idx}
                          onChange={() => updateQuestion(q.id, 'correctAnswer', idx)}
                          className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          title="Mark as correct answer"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    
                    <input 
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(q.id, idx, e.target.value)}
                      className="flex-1 text-sm border-none bg-slate-50 rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button onClick={() => removeOption(q.id, idx)} className="text-slate-300 hover:text-slate-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addOption(q.id)}
                  className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center space-x-1 mt-2"
                >
                  <Plus size={14} />
                  <span>Add Option</span>
                </button>
                {form.type === 'quiz' && (
                  <p className="text-xs text-slate-400 mt-2 italic">* Select the radio button to mark the correct answer.</p>
                )}
              </div>
            )}

            {q.type === 'text' && (
              <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm italic">
                Participant will type their answer here.
              </div>
            )}

            {q.type === 'rating' && (
              <div className="flex items-center space-x-1 text-slate-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} />
                ))}
                <span className="ml-2 text-xs text-slate-400">(1-5 Scale)</span>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t flex items-center justify-end space-x-4">
               <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer select-none">
                 <input 
                    type="checkbox" 
                    checked={q.required}
                    onChange={(e) => updateQuestion(q.id, 'required', e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                 />
                 <span>Required</span>
               </label>
            </div>
          </div>
        ))}

        {/* Add Question Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => addQuestion('multiple_choice')} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
            <CheckSquare className="mb-2 text-slate-400 group-hover:text-indigo-600" />
            <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700">Multiple Choice</span>
          </button>
          <button onClick={() => addQuestion('text')} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
            <Type className="mb-2 text-slate-400 group-hover:text-indigo-600" />
            <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700">Text Answer</span>
          </button>
          <button onClick={() => addQuestion('rating')} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
            <Star className="mb-2 text-slate-400 group-hover:text-indigo-600" />
            <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700">Rating</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Form Preview (Read Only)
const FormPreview = ({ form, onBack }: { form: any; onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-indigo-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-500">
            <Settings size={16} />
            <span className="text-sm font-medium">Preview Mode (Not Interactive)</span>
          </div>
          <button onClick={onBack} className="text-sm text-indigo-600 hover:underline">
            Back to Editor
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-8 px-4 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border-t-8 border-t-indigo-600 p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{form.title || 'Untitled Form'}</h1>
          <p className="text-slate-600">{form.description}</p>
        </div>

        {form.questions.map((q: any) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4">{q.text}</h3>
            {q.type === 'multiple_choice' && (
              <div className="space-y-2">
                {q.options.map((opt: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-slate-600">
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}
             {q.type === 'text' && <div className="border-b border-slate-300 h-8 w-full" />}
             {q.type === 'rating' && <div className="text-slate-400 text-sm">Star Rating (1-5)</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function Home() {
  const [view, setView] = useState('landing'); // landing, builder, preview
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'quiz', // quiz or survey
    questions: []
  });

  const handleCreate = (type: string) => {
    setForm({ ...form, type, questions: [] });
    setView('builder');
  };

  return (
    <main>
      {view === 'landing' && <LandingScreen onCreate={handleCreate} />}
      
      {view === 'builder' && (
        <Builder 
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