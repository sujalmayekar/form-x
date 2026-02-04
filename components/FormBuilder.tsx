import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowLeft,
  CheckSquare,
  Type,
  Star,
  Play,
  ChevronRight,
  GripVertical,
  Palette,
  Layout,
  Calendar,
} from "lucide-react";
import { Form, QuestionType } from "@/lib/types";

interface FormBuilderProps {
  form: Form;
  setForm: (form: Form | ((prev: Form) => Form)) => void;
  onPreview: () => void;
  onExit: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  form,
  setForm,
  onPreview,
  onExit,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

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
        const link = `${window.location.origin}/take/${data.id}`;
        setShareLink(link);
        setShareCopied(false);
      } else {
        alert('Error saving form: ' + data.error);
      }
    } catch (error) {
      alert('Something went wrong while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = (type: QuestionType) => {
    const newId = Date.now();
    const newQuestion: any = {
      id: newId,
      type,
      text: '',
      required: true,
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2'] : [],
      correctAnswer: type === 'multiple_choice' ? 0 : null,
      maxRating: 5
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
    setActiveQuestionId(newId);
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
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-background/50 backdrop-blur-md z-40 flex items-center justify-between px-4 sticky top-0 animate-slide-up">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-all duration-300 hover:scale-110 button-press"
          >
            <ArrowLeft size={16} className="transition-transform duration-300 hover:-translate-x-1" />
          </button>
          <div className="h-4 w-[1px] bg-border transition-all duration-300 hover:h-6" />
          <div className="flex flex-col">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-transparent text-sm font-semibold text-foreground focus:outline-none w-64 placeholder-zinc-600 transition-all duration-300 focus:scale-105 focus:translate-x-1"
              placeholder="Untitled Form"
            />
          </div>
          <div className={`px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-mono text-zinc-500 transition-all duration-300 ${isSaving ? 'animate-pulse-subtle' : 'hover:border-emerald-500/50'}`}>
            {isSaving ? "Saving..." : "Saved"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${form.isOpen !== false ? 'bg-emerald-500 animate-pulse-subtle' : 'bg-zinc-600'}`} />
            <button
              onClick={() =>
                setForm((prev: Form) => ({
                  ...prev,
                  isOpen: prev.isOpen ?? true ? false : true,
                }))
              }
              className="text-xs font-medium text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105 button-press"
            >
              {form.isOpen !== false ? "Active" : "Closed"}
            </button>
          </div>

          <button
            onClick={onPreview}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-md button-press"
          >
            Preview
          </button>
          <button
            onClick={saveForm}
            disabled={isSaving}
            className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-zinc-200 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed button-press ripple"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
              "Publish Changes"
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-64 border-r border-border bg-zinc-950/30 flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Form Elements</h2>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            <PaletteButton
              icon={<CheckSquare className="w-4 h-4" />}
              label="Multiple Choice"
              onClick={() => addQuestion("multiple_choice")}
            />
            <PaletteButton
              icon={<Type className="w-4 h-4" />}
              label="Short Text"
              onClick={() => addQuestion("text")}
            />
            <PaletteButton
              icon={<Type className="w-4 h-4" />}
              label="Long Text"
              onClick={() => addQuestion("long_text")}
            />
            <PaletteButton
              icon={<Calendar className="w-4 h-4" />}
              label="Date"
              onClick={() => addQuestion("date")}
            />
            <PaletteButton
              icon={<Star className="w-4 h-4" />}
              label="Rating"
              onClick={() => addQuestion("rating")}
            />
          </div>

          <div className="p-4 border-t border-border mt-auto">
            <div className="text-[10px] text-zinc-600 font-mono text-center">
              MONOCHROME
            </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] relative">
          <div className="absolute inset-0 z-0 opacity-20 technical-grid pointer-events-none" />

          <div className="max-w-3xl mx-auto py-12 px-8 space-y-8 relative z-10">
            {/* Header Card */}
            <div className="group relative">
              <input
                className="w-full bg-transparent text-4xl font-serif text-white placeholder-zinc-700 outline-none border-none p-0"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Form Title"
              />
              <textarea
                className="w-full bg-transparent mt-2 text-zinc-400 resize-none outline-none border-none p-0 h-auto"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Add a description..."
                rows={2}
              />
            </div>

            <div className="space-y-6">
              {form.questions.map((q: any, index: number) => (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`group relative p-6 rounded-lg border transition-all duration-300 cursor-pointer ${activeQuestionId === q.id
                    ? "bg-zinc-900 border-zinc-700 ring-1 ring-zinc-700 scale-[1.02] shadow-lg"
                    : "bg-transparent border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 hover:scale-[1.01]"
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute left-2 top-6 text-xs font-mono text-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="pl-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <input
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                        className="flex-1 bg-transparent font-medium text-lg text-white border-none p-0 focus:ring-0 placeholder-zinc-600 transition-all duration-300 focus:scale-[1.02] focus:translate-x-1"
                        placeholder="Write your question here..."
                      />
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                        className="bg-zinc-900 text-xs font-medium text-zinc-400 border border-zinc-800 rounded px-2 py-1 outline-none focus:border-zinc-600 transition-all duration-300 hover:scale-105 hover:bg-zinc-800 cursor-pointer"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="text">Short Text</option>
                        <option value="long_text">Long Text</option>
                        <option value="date">Date</option>
                        <option value="rating">Rating</option>
                      </select>
                    </div>

                    <div className="pl-1">
                      {q.type === "multiple_choice" && (
                        <div className="space-y-2">
                          {q.options.map((opt: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 group/opt">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${q.correctAnswer === idx
                                  ? "border-emerald-500 bg-emerald-500/20"
                                  : "border-zinc-700 hover:border-zinc-500"
                                  }`}
                                onClick={() => form.type === "quiz" && updateQuestion(q.id, "correctAnswer", idx)}
                              >
                                {q.correctAnswer === idx && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                              </div>
                              <input
                                value={opt}
                                onChange={(e) => updateOption(q.id, idx, e.target.value)}
                                className="flex-1 bg-transparent border-none p-0 text-sm text-zinc-300 focus:ring-0"
                              />
                              <button onClick={() => removeOption(q.id, idx)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover/opt:opacity-100 transition-all duration-300 hover:scale-110 hover:rotate-12 button-press">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => addOption(q.id)} className="text-xs font-medium text-zinc-500 hover:text-white flex items-center gap-1 mt-2 transition-all duration-300 hover:scale-105 hover:translate-x-1 button-press">
                            <Plus size={12} className="transition-transform duration-300 hover:rotate-90" /> Add Option
                          </button>
                        </div>
                      )}

                      {/* Placeholders for other types */}
                      {q.type === "text" && <div className="h-9 border-b border-zinc-800 w-1/2" />}
                      {q.type === "long_text" && <div className="h-20 border-b border-zinc-800 w-3/4" />}
                      {q.type === "date" && <div className="h-9 border-b border-zinc-800 w-1/3 flex items-center text-zinc-700"><Calendar size={14} /></div>}
                      {q.type === "rating" && (
                        <div className="flex gap-1 text-zinc-800">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} />)}
                        </div>
                      )}
                    </div>

                    {/* Actions Footer */}
                    <div className={`flex items-center justify-between pt-4 ${activeQuestionId === q.id ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                      <div className="flex items-center gap-4">
                        <button onClick={() => deleteQuestion(q.id)} className="text-zinc-500 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:rotate-12 button-press">
                          <Trash2 size={14} />
                        </button>
                        <div className="h-3 w-[1px] bg-zinc-800" />
                        {q.type === 'multiple_choice' && (
                          <>
                            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-white transition-colors duration-200">
                              <input
                                type="checkbox"
                                checked={q.allowMultiple || false}
                                onChange={(e) => updateQuestion(q.id, 'allowMultiple', e.target.checked)}
                                className="rounded border-zinc-700 bg-zinc-900 focus:ring-0 text-emerald-500"
                              />
                              Allow Multiple Answers
                            </label>
                            <div className="h-3 w-[1px] bg-zinc-800" />
                          </>
                        )}
                        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-white transition-colors duration-200">
                          <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(q.id, 'required', e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 focus:ring-0 text-white" />
                          Required
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => addQuestion("text")}
                className="w-full py-8 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 hover:bg-white/[0.02] transition-all duration-300 flex flex-col items-center gap-2 hover:scale-[1.02] hover:shadow-lg button-press ripple group"
              >
                <Plus size={20} className="transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
                <span className="text-sm font-medium transition-all duration-300 group-hover:translate-y-[-2px]">Add new question</span>
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-72 border-l border-border bg-zinc-950/30 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Configuration</h2>
          </div>
          <div className="p-4">
            <ThemeSettingsPanel form={form} setForm={setForm} />
          </div>
        </aside>
      </div>

      {/* Share Toast */}
      {shareLink && (
        <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-2xl flex items-center gap-4 hover-lift transition-all duration-300 hover:border-emerald-500/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                <CheckSquare size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Form Published</p>
                <p className="text-xs text-zinc-500">Ready to collect responses</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareLink}
                className="bg-black/20 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400 w-32 outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="text-xs font-semibold text-white hover:text-zinc-300 transition-all duration-300 hover:scale-105 button-press"
              >
                {shareCopied ? "Copied ✓" : "Copy"}
              </button>
              <button onClick={() => setShareLink(null)} className="ml-2 text-zinc-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 button-press">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaletteButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300 group hover:translate-x-1 hover:shadow-md button-press ripple"
  >
    <div className="text-zinc-600 group-hover:text-zinc-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
      {icon}
    </div>
    <span className="transition-all duration-300">{label}</span>
  </button>
);

const ThemeSettingsPanel = ({ form, setForm }: { form: Form; setForm: (form: Form | ((prev: Form) => Form)) => void }) => {
  const updateTheme = (key: string, value: any) => {
    setForm({
      ...form,
      theme: {
        ...(form.theme || {}),
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-400">Accent Color</label>
        <div className="grid grid-cols-6 gap-2">
          {['#fafafa', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b', '#71717a'].map(color => (
            <button
              key={color}
              onClick={() => updateTheme('primaryColor', color)}
              className={`w-6 h-6 rounded border transition-all ${(form.theme?.primaryColor || '#fafafa') === color
                ? 'border-white ring-1 ring-white'
                : 'border-transparent ring-1 ring-zinc-800 hover:ring-zinc-600'
                }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="relative group w-6 h-6">
            <input
              type="color"
              value={form.theme?.primaryColor || '#fafafa'}
              onChange={(e) => updateTheme('primaryColor', e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
            />
            <div className="w-full h-full rounded border border-zinc-800 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 hover:border-zinc-600 transition-all shadow-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-400">Font</label>
        <select
          value={form.theme?.fontFamily || 'inter'}
          onChange={(e) => updateTheme('fontFamily', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-sm p-2 text-zinc-300 outline-none focus:border-zinc-700"
        >
          <option value="inter">Inter (Sans)</option>
          <option value="roboto">Roboto</option>
          <option value="open-sans">Open Sans</option>
          <option value="lato">Lato</option>
          <option value="montserrat">Montserrat</option>
          <option value="poppins">Poppins</option>
          <option value="playfair">Playfair (Serif)</option>
          <option value="merriweather">Merriweather (Serif)</option>
          <option value="mono">Monospace</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-400">Border Radius</label>
        <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800">
          {['sm', 'md', 'lg'].map(radius => (
            <button
              key={radius}
              onClick={() => updateTheme('borderRadius', radius)}
              className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-colors ${(form.theme?.borderRadius || 'lg') === radius
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-600 hover:text-zinc-400'
                }`}
            >
              {radius}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-400">Background Pattern</label>
        <select
          value={form.theme?.backgroundPattern || 'none'}
          onChange={(e) => updateTheme('backgroundPattern', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-sm p-2 text-zinc-300 outline-none focus:border-zinc-700"
        >
          <option value="none">None</option>
          <option value="grid">Grid (Technical)</option>
          <option value="polka">Polka Dot</option>
          <option value="stripes">Stripes</option>
          <option value="wavy">Wavy Lines</option>
          <option value="solid">Solid Color</option>
        </select>
      </div>

      <hr className="border-zinc-800" />

      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-400">Availability</label>
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-zinc-500 uppercase">Starts</label>
            <input
              type="date"
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
              value={form.startDate ? new Date(form.startDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setForm({ ...form, startDate: e.target.value ? new Date(e.target.value) : undefined })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-zinc-500 uppercase">Ends</label>
            <input
              type="date"
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
              value={form.endDate ? new Date(form.endDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setForm({ ...form, endDate: e.target.value ? new Date(e.target.value) : undefined })}
            />
          </div>
        </div>
      </div>

      <hr className="border-zinc-800" />

      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-400">Thank You Message</label>
        <input
          value={form.thankYouTitle || ''}
          onChange={(e) => setForm({ ...form, thankYouTitle: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm text-zinc-300 outline-none focus:border-zinc-700 placeholder-zinc-700"
          placeholder="Submission Received"
        />
        <textarea
          value={form.thankYouDescription || ''}
          onChange={(e) => setForm({ ...form, thankYouDescription: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm text-zinc-300 outline-none focus:border-zinc-700 placeholder-zinc-700 resize-none"
          placeholder="Thanks for filling this out."
          rows={2}
        />
      </div>
    </div>
  );
};

export default FormBuilder;
