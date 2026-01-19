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
      poppins: 'Poppins, var(--font-sans)',
      playfair: '"Playfair Display", var(--font-display)',
      merriweather: 'Merriweather, serif',
      mono: 'monospace',
    };

    return {
      primary: form.theme?.primaryColor || '#fafafa',
      background: form.theme?.backgroundColor || '#09090b',
      card: form.theme?.cardBackground || '#18181b',
      text: form.theme?.textColor || '#f4f4f5',
      border: form.theme?.borderColor || '#27272a',
      radius: radiusMap[form.theme?.borderRadius || 'lg'],
      font: fontMap[form.theme?.fontFamily || 'inter'],
      headerStyle: form.theme?.headerStyle || 'default',
      pattern: form.theme?.backgroundPattern || 'none',
    };
  }, [form.theme]);

  // Ensure high contrast for text if the primary color is light
  const isLightPrimary = theme.primary.toLowerCase() === '#ffffff' || theme.primary.toLowerCase() === '#fafafa';

  const getPatternStyle = () => {
    switch (theme.pattern) {
      case 'grid':
        return {
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        };
      case 'polka':
        return {
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'stripes':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 10px, transparent 10px, transparent 20px)`,
        };
      case 'wavy':
        return {
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255, 255, 255, 0.03) 10px), repeating-linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03))`,
        };
      case 'solid':
      default:
        return {};
    }
  };

  return (
    <div
      className="min-h-screen pb-28 relative overflow-hidden font-sans bg-zinc-950 text-zinc-100"
      style={{
        fontFamily: theme.font,
        backgroundColor: theme.background,
      }}
    >
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={getPatternStyle()}
      />

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-400">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-white shadow-sm">
              <Eye size={16} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">Preview Mode</span>
              <span className="text-sm font-medium text-zinc-200">How your form appears to respondents</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md border border-white/10 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-lg button-press"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
            Exit Preview
          </button>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto mt-12 px-6 relative z-10 space-y-8">
        {/* Form Header Card */}
        <div
          className="relative overflow-hidden border border-white/10 shadow-2xl shadow-black/50 animate-fade-in hover-lift transition-all duration-300"
          style={{
            borderRadius: theme.radius,
            backgroundColor: theme.card,
            borderTop: theme.headerStyle === 'banner' ? `8px solid ${theme.primary}` : '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {theme.headerStyle === 'minimal' && (
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.primary }} />
          )}

          <div className="relative p-8 md:p-10 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 w-full">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight" style={{ color: theme.text }}>
                  {form.title || 'Untitled Form'}
                </h1>
                {form.description ? (
                  <p className="text-base md:text-lg opacity-80 leading-relaxed font-light" style={{ color: theme.text }}>
                    {form.description}
                  </p>
                ) : (
                  <p className="text-sm italic opacity-50" style={{ color: theme.text }}>Add a description to help respondents.</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-white/10 text-white/50 bg-white/5">
                {form.type === 'quiz' ? 'Quiz' : 'Survey'}
              </span>
            </div>
          </div>
        </div>

        {/* Form body */}
        <div className="space-y-4">
          {form.questions.length === 0 && (
            <div
              className="flex items-center justify-center gap-3 p-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-zinc-500"
              style={{ borderRadius: theme.radius }}
            >
              <div className="text-center space-y-2">
                <Sparkles size={24} className="text-zinc-700 mx-auto" />
                <p className="font-medium text-zinc-400">No fields yet</p>
                <p className="text-sm text-zinc-600">Add a question to see the live preview.</p>
              </div>
            </div>
          )}

          {form.questions.map((q: any, index: number) => (
            <div
              key={q.id}
              className="relative overflow-hidden border border-white/5 bg-zinc-900/40 hover:border-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg animate-fade-in"
              style={{
                borderRadius: theme.radius,
                backgroundColor: theme.card, // Respect user preference for card bg, usually dark in this theme
                borderColor: theme.border,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium leading-snug" style={{ color: theme.text }}>
                    {q.text || <span className="opacity-50 italic">Untitled question</span>}
                    {q.required && <span className="text-red-500 opacity-80 ml-1" title="Required">*</span>}
                  </h3>
                </div>

                <div className="opacity-80">
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {q.options?.map((opt: string, idx: number) => (
                        <label
                          key={idx}
                          className="group flex items-center gap-4 p-4 rounded-lg border border-white/5 bg-white/5 transition-all duration-200 cursor-not-allowed opacity-70"
                          style={{ borderRadius: theme.radius }}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center ${q.allowMultiple ? 'rounded-md' : 'rounded-full'} border-2 border-white/20`}
                          />
                          <span className="text-base" style={{ color: theme.text }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <div className="relative">
                      <input
                        disabled
                        placeholder="Your answer"
                        className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 focus:outline-none cursor-not-allowed placeholder:text-white/20 text-lg"
                        style={{ color: theme.text }}
                      />
                    </div>
                  )}

                  {q.type === 'long_text' && (
                    <div className="relative">
                      <textarea
                        disabled
                        rows={3}
                        placeholder="Your detailed answer"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:outline-none cursor-not-allowed placeholder:text-white/20 text-base resize-none"
                        style={{ color: theme.text, borderRadius: theme.radius }}
                      />
                    </div>
                  )}

                  {q.type === 'date' && (
                    <div className="relative">
                      <div className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-white/40 cursor-not-allowed flex items-center justify-between">
                        <span>Select a date</span>
                        <span className="opacity-50">📅</span>
                      </div>
                    </div>
                  )}

                  {q.type === 'rating' && (
                    <div className="flex items-center gap-2">
                      {[...Array(q.maxRating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          size={28}
                          className="text-white/10 fill-white/5"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 pb-10">
          <div className="text-xs text-zinc-500 font-mono">
            PREVIEW MODE • INPUTS DISABLED
          </div>
          <button
            className="px-8 py-3 text-sm font-bold rounded-md shadow-lg opacity-50 cursor-not-allowed flex items-center gap-2 text-zinc-900 transition-all duration-300"
            style={{
              backgroundColor: theme.primary,
              borderRadius: theme.radius,
              color: isLightPrimary ? '#000000' : '#ffffff'
            }}
            disabled
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
