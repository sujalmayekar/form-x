import React, { useMemo } from 'react';
import { Eye, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { Form } from '@/lib/types';

interface FormPreviewProps {
  form: Form;
  onBack: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form, onBack }) => {
  const theme = useMemo(() => {
    const radiusMap: Record<string, string> = {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      full: '999px',
    };

    const fontMap: Record<string, string> = {
      inter: 'Inter, var(--font-sans)',
      roboto: 'Roboto, var(--font-sans)',
      'open-sans': '"Open Sans", var(--font-sans)',
      lato: 'Lato, var(--font-sans)',
      montserrat: 'Montserrat, var(--font-sans)',
      playfair: '"Playfair Display", var(--font-display)',
    };

    return {
      primary: form.theme?.primaryColor || '#7c3aed',
      background: form.theme?.backgroundColor || '#0b1220',
      card: form.theme?.cardBackground || '#0f172a',
      text: form.theme?.textColor || '#e2e8f0',
      border: form.theme?.borderColor || '#1f2937',
      radius: radiusMap[form.theme?.borderRadius || 'lg'],
      font: fontMap[form.theme?.fontFamily || 'inter'],
      headerStyle: form.theme?.headerStyle || 'default',
    };
  }, [form.theme]);

  return (
    <div
      className="min-h-screen pb-28 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 20% 20%, ${theme.primary}0d, transparent 35%), radial-gradient(circle at 80% 0%, ${theme.primary}1f, transparent 30%), ${theme.background}`,
        color: theme.text,
        fontFamily: theme.font,
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-10 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: theme.primary }} />
        <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: '#22d3ee' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0,rgba(255,255,255,0)_45%)]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-primary shadow-lg shadow-primary/20">
              <Eye size={18} />
              <Sparkles className="absolute -right-1 -bottom-1 text-amber-300" size={14} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Live preview</span>
              <span className="text-base font-semibold">See exactly what responders see</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Exit Preview
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-6 relative z-10 space-y-8">
        {/* Hero */}
        <div
          className="relative overflow-hidden border border-white/10 rounded-2xl shadow-2xl shadow-black/30"
          style={{ borderRadius: theme.radius }}
        >
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}33, transparent 60%), radial-gradient(circle at 20% 30%, ${theme.primary}15, transparent 40%)`,
            }}
          />
          <div className="relative p-8 md:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              Preview ready
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-sm" style={{ color: theme.text }}>
                  {form.title || 'Untitled Form'}
                </h1>
                {form.description ? (
                  <p className="text-base md:text-lg text-slate-300/90 max-w-3xl">
                    {form.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">Add a description to help respondents.</p>
                )}
              </div>
              <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 shadow-lg">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{form.type === 'quiz' ? 'Quiz' : 'Survey'}</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-white/10 text-slate-200">Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form body */}
        <div className="space-y-4">
          {form.questions.length === 0 && (
            <div
              className="flex items-center gap-3 p-5 border border-dashed border-white/15 rounded-2xl bg-white/5 text-slate-300"
              style={{ borderRadius: theme.radius }}
            >
              <Sparkles size={18} className="text-amber-300" />
              <div className="flex-1">
                <p className="font-semibold">No fields yet</p>
                <p className="text-sm text-slate-400">Add a question to see the live preview.</p>
              </div>
            </div>
          )}

          {form.questions.map((q: any, index: number) => (
            <div
              key={q.id}
              className="relative overflow-hidden border border-white/8 bg-white/5 shadow-xl shadow-black/20 animate-fade-in"
              style={{
                borderRadius: theme.radius,
                animationDelay: `${index * 60}ms`,
              }}
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: theme.primary }} />
              <div className="relative p-6 md:p-7 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: theme.primary }} />
                      Question {index + 1}
                      <span className="rounded-full px-2 py-0.5 bg-white/10 border border-white/10 text-[11px] font-semibold">
                        {q.type.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mt-2 flex items-center gap-2">
                      {q.text || <span className="text-slate-500 italic">Untitled question</span>}
                      {q.required && <span className="text-rose-400 text-base">*</span>}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Respondent view</span>
                </div>

                {q.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {q.options?.map((opt: string, idx: number) => (
                      <label
                        key={idx}
                        className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                        style={{ borderRadius: theme.radius }}
                      >
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 group-hover:border-white/50"
                          style={{ borderColor: theme.primary }}
                        >
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: theme.primary, opacity: 0.5 }} />
                        </span>
                        <span className="text-sm md:text-base text-slate-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'text' && (
                  <div className="relative">
                    <input
                      disabled
                      placeholder="Your answer"
                      className="w-full bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 rounded-xl px-4 py-3 focus:outline-none cursor-not-allowed"
                      style={{ borderRadius: theme.radius }}
                    />
                    <div className="absolute inset-0 rounded-xl border border-transparent pointer-events-none" style={{ boxShadow: `0 15px 45px -25px ${theme.primary}` }} />
                  </div>
                )}

                {q.type === 'rating' && (
                  <div className="flex items-center gap-2">
                    {[...Array(q.maxRating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        size={32}
                        className="transition-transform duration-200 hover:scale-110"
                        style={{ color: theme.primary, opacity: 0.25 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
          <button
            className="px-8 py-3 text-sm font-semibold rounded-full shadow-lg shadow-black/30 transition-all duration-200 flex items-center gap-2 border border-white/10 bg-white/5 text-white"
            style={{ background: theme.primary, borderColor: theme.primary }}
            disabled
          >
            Submit (disabled in preview)
          </button>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse-soft" />
            This is a live preview only. Real inputs are disabled.
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex justify-center mt-16 px-6">
        <div className="text-slate-500 text-xs font-medium bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur">
          Powered by <span className="text-white font-semibold">Form X</span>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;