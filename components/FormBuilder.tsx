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
    <div className="min-h-screen bg-slate-950 pb-24 font-sans selection:bg-slate-700 selection:text-slate-50 text-slate-100 relative overflow-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 w-80 h-80 rounded-full blur-3xl opacity-30 bg-primary" />
        <div className="absolute top-10 right-0 w-[420px] h-[420px] rounded-full blur-[110px] opacity-25 bg-cyan-300" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.04),transparent_40%)]" />
      </div>

      <div className="sticky top-0 z-30 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="group p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft
                size={20}
                className="text-slate-300 group-hover:text-white transition-colors"
              />
            </button>
            <div className="flex flex-col">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none w-64 placeholder-slate-500"
                placeholder="Untitled Form"
              />
              <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400">
                {isSaving ? "Saving..." : "All changes saved"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
              <span className="uppercase tracking-[0.18em] text-slate-500">Status</span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev: Form) => ({
                    ...prev,
                    isOpen: prev.isOpen ?? true ? false : true,
                  }))
                }
                className="flex items-center gap-2"
              >
                <span
                  className={`relative inline-flex items-center w-10 h-5 rounded-full border transition-colors ${
                    form.isOpen ?? true 
                      ? "bg-emerald-400/80 border-emerald-400" 
                      : "bg-slate-700/80 border-slate-600"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow-sm shadow-black/30 transform transition-transform ${
                      form.isOpen ?? true ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </span>
                <span className="text-[11px] text-slate-300 min-w-[120px]">
                  {form.isOpen ?? true ? "Accepting responses" : "Closed to responses"}
                </span>
              </button>
            </div>

            <button
              onClick={onPreview}
              className="px-4 py-2 text-sm rounded-xl border border-white/10 text-white hover:bg-white/5 transition bg-white/5"
            >
              Preview
            </button>
            <button
              onClick={saveForm}
              disabled={isSaving}
              className="px-5 py-2 bg-white text-slate-900 text-sm font-semibold rounded-full shadow-lg shadow-primary/30 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-60"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto mt-10 px-6 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] gap-6">
        <div className="space-y-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sticky top-24">
            <h4 className="text-sm font-semibold mb-3 text-white">
              Add Fields
            </h4>
            <div className="space-y-2">
              <PaletteButton
                icon={<CheckSquare className="w-4 h-4" />}
                label="Multiple Choice"
                onClick={() => addQuestion("multiple_choice")}
              />
              <PaletteButton
                icon={<Type className="w-4 h-4" />}
                label="Text"
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
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/30 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />
            <div className="relative">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full text-4xl md:text-5xl font-bold tracking-tight text-white bg-transparent border-none p-0 focus:ring-0 placeholder-slate-500 focus:outline-none mb-4"
                placeholder="Form Title"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full text-lg text-slate-300 bg-transparent border-none p-0 focus:ring-0 placeholder-slate-500 focus:outline-none resize-none"
                placeholder="Add a description..."
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-4">
            {form.questions.map((q: any, index: number) => (
              <div
                key={q.id}
                onClick={() => setActiveQuestionId(q.id)}
                className={`group bg-white/5 border rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 ${
                  activeQuestionId === q.id
                    ? "border-white/20 shadow-2xl shadow-black/40 shadow-primary/10"
                    : "border-white/10 hover:border-white/15 shadow-xl shadow-black/30"
                }`}
              >
                <div className="flex gap-4">
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <GripVertical className="w-4 h-4" />
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white font-semibold text-sm border border-white/10">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                        className="flex-1 text-xl font-medium bg-transparent border-0 border-b border-white/10 focus:border-white/30 focus:ring-0 px-0 py-1 transition-colors placeholder-slate-500 text-white"
                        placeholder="Question"
                      />

                      <div className="relative flex-shrink-0">
                        <select
                          value={q.type}
                          onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                          className="appearance-none pl-3 pr-8 py-2 bg-white/5 rounded-xl text-sm font-medium border border-white/10 focus:ring-1 focus:ring-white/30 cursor-pointer hover:bg-white/10 transition-colors text-white"
                        >
                          <option value="multiple_choice" className="bg-slate-900 text-white">Multiple Choice</option>
                          <option value="text" className="bg-slate-900 text-white">Short Text</option>
                          <option value="long_text" className="bg-slate-900 text-white">Long Text</option>
                          <option value="date" className="bg-slate-900 text-white">Date</option>
                          <option value="rating" className="bg-slate-900 text-white">Rating</option>
                        </select>
                        <ChevronRight
                          size={14}
                          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 rotate-90"
                        />
                      </div>
                    </div>

                    <div>
                      {q.type === "multiple_choice" && (
                        <div className="space-y-3">
                          {q.options.map((opt: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                                  q.correctAnswer === idx
                                    ? "border-accent bg-accent"
                                    : "border-white/15 hover:border-white/40"
                                }`}
                                onClick={() =>
                                  form.type === "quiz" && updateQuestion(q.id, "correctAnswer", idx)
                                }
                              >
                                {q.correctAnswer === idx && (
                                  <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                                )}
                              </div>
                              <input
                                value={opt}
                                onChange={(e) => updateOption(q.id, idx, e.target.value)}
                                className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-white placeholder-slate-500"
                              />
                              <button
                                onClick={() => removeOption(q.id, idx)}
                                className="text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(q.id)}
                            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1 mt-2 pl-8"
                          >
                            <Plus size={16} /> Add Option
                          </button>
                        </div>
                      )}

                      {q.type === "text" && (
                        <div className="w-full h-10 rounded-xl border border-dashed border-white/10 bg-white/5 flex items-center px-3 text-muted-foreground text-sm">
                          Short text input
                        </div>
                      )}

                      {q.type === "long_text" && (
                        <div className="w-full h-24 rounded-xl border border-dashed border-white/10 bg-white/5 flex items-center px-3 text-muted-foreground text-sm">
                          Long text area
                        </div>
                      )}

                      {q.type === "date" && (
                        <div className="w-full h-10 rounded-xl border border-dashed border-white/10 bg-white/5 flex items-center px-3 text-muted-foreground text-sm">
                          Date picker
                        </div>
                      )}

                      {q.type === "rating" && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} size={28} className="text-white/15 fill-white/10" />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                          <span>Required</span>
                          <div
                            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                              q.required ? "bg-emerald-400" : "bg-white/10"
                            }`}
                          >
                            <div
                              className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${
                                q.required ? "translate-x-4" : ""
                              }`}
                            />
                          </div>
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {/* Theme Settings Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sticky top-24 space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Palette className="w-4 h-4" />
              Theme Settings
            </div>
            
            <ThemeSettingsPanel form={form} setForm={setForm} />
          </div>
        </div>
      </div>

      {/* Share banner for newly published form */}
      {shareLink && (
        <div className="fixed bottom-4 right-4 z-40 max-w-md w-full px-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Form published
                </p>
                <p className="text-sm font-medium text-white">
                  Share your form with this link
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareLink(null)}
                className="text-slate-400 hover:text-white text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                readOnly
                value={shareLink}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white overflow-x-auto"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareLink);
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 1500);
                  } catch (e) {
                    console.error("Failed to copy link", e);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-semibold shadow-lg shadow-black/30 hover:bg-slate-100 transition-colors"
              >
                {shareCopied ? "Copied" : "Copy"}
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
    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-sm font-medium text-white transition-all shadow-sm shadow-black/20 hover:shadow-md"
  >
    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300">
      {icon}
    </div>
    <span>{label}</span>
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

  const colorPresets = [
    '#4f46e5', // Indigo
    '#7c3aed', // Purple
    '#dc2626', // Red
    '#ea580c', // Orange
    '#059669', // Emerald
    '#0284c7', // Sky
    '#be185d', // Pink
    '#0891b2', // Cyan
  ];

  const fonts = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'open-sans', label: 'Open Sans' },
    { value: 'lato', label: 'Lato' },
    { value: 'montserrat', label: 'Montserrat' },
    { value: 'playfair', label: 'Playfair Display' },
  ];

  return (
    <div className="space-y-5">
      {/* Primary Color */}
      <div>
        <label className="text-xs font-medium mb-2 block text-white">Primary Color</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {colorPresets.map(color => (
            <button
              key={color}
              onClick={() => updateTheme('primaryColor', color)}
              className={`w-6 h-6 rounded-lg border-2 transition ${
                (form.theme?.primaryColor || '#4f46e5') === color 
                  ? 'border-white scale-110' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={form.theme?.primaryColor || '#4f46e5'}
          onChange={(e) => updateTheme('primaryColor', e.target.value)}
          className="w-full h-8 rounded-lg cursor-pointer border border-white/10"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="text-xs font-medium mb-2 block text-white">Background Color</label>
        <input
          type="color"
          value={form.theme?.backgroundColor || '#f8fafc'}
          onChange={(e) => updateTheme('backgroundColor', e.target.value)}
          className="w-full h-8 rounded-xl cursor-pointer border border-white/10 bg-white/5"
        />
      </div>

      {/* Card Background */}
      <div>
        <label className="text-xs font-medium mb-2 block text-white">Card Background</label>
        <input
          type="color"
          value={form.theme?.cardBackground || '#ffffff'}
          onChange={(e) => updateTheme('cardBackground', e.target.value)}
          className="w-full h-8 rounded-xl cursor-pointer border border-white/10 bg-white/5"
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="text-xs font-medium mb-2 block text-white flex items-center gap-1">
          <Type className="w-3 h-3" />
          Font Family
        </label>
        <select
          value={form.theme?.fontFamily || 'inter'}
          onChange={(e) => updateTheme('fontFamily', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
        >
          {fonts.map(font => (
            <option key={font.value} value={font.value} className="bg-slate-900">
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Border Radius */}
      <div>
        <label className="text-xs font-medium mb-2 block text-white">Border Radius</label>
        <select
          value={form.theme?.borderRadius || 'lg'}
          onChange={(e) => updateTheme('borderRadius', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
        >
          <option value="sm" className="bg-slate-900">Small</option>
          <option value="md" className="bg-slate-900">Medium</option>
          <option value="lg" className="bg-slate-900">Large</option>
          <option value="xl" className="bg-slate-900">Extra Large</option>
          <option value="full" className="bg-slate-900">Full (Pill)</option>
        </select>
      </div>

      {/* Header Style */}
      <div>
        <label className="text-xs font-medium mb-2 block text-white flex items-center gap-1">
          <Layout className="w-3 h-3" />
          Header Style
        </label>
        <select
          value={form.theme?.headerStyle || 'default'}
          onChange={(e) => updateTheme('headerStyle', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
        >
          <option value="default" className="bg-slate-900">Default</option>
          <option value="centered" className="bg-slate-900">Centered</option>
          <option value="minimal" className="bg-slate-900">Minimal</option>
          <option value="banner" className="bg-slate-900">Banner</option>
        </select>
      </div>

      {/* Thank You Title */}
      <div>
        <label className="text-xs font-medium mb-2 block text-foreground">Thank You Title</label>
        <input
          type="text"
          value={form.thankYouTitle || ''}
          onChange={(e) => setForm({ ...form, thankYouTitle: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Submission received!"
        />
      </div>

      {/* Thank You Description */}
      <div>
        <label className="text-xs font-medium mb-2 block text-foreground">Thank You Description</label>
        <textarea
          value={form.thankYouDescription || ''}
          onChange={(e) => setForm({ ...form, thankYouDescription: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="Thank you for completing this form."
          rows={2}
        />
      </div>
    </div>
  );
};

export default FormBuilder;