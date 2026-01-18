'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, Check } from 'lucide-react';

export default function TakeQuizPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm(data.form);
        } else {
          alert('Form not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAnswerChange = (qId: number, value: any) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = async () => {
    if (form?.questions.some((q: any) => q.required && !answers[q.id] && answers[q.id] !== 0)) {
      alert("Please answer all required questions.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: id, answers }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        if (result.score !== undefined) setScore(result.score);
      } else {
        alert("Submission failed.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper functions for theme
  const getBorderRadius = (radius?: string) => {
    const map: Record<string, string> = {
      'sm': 'rounded-md',
      'md': 'rounded-lg',
      'lg': 'rounded-xl',
      'xl': 'rounded-2xl',
      'full': 'rounded-full'
    };
    return map[radius || 'lg'] || 'rounded-xl';
  };

  const getFontClass = (font?: string) => {
    const fontMap: Record<string, string> = {
      'inter': 'font-sans',
      'roboto': 'font-sans',
      'open-sans': 'font-sans',
      'lato': 'font-sans',
      'montserrat': 'font-sans',
      'playfair': 'font-serif'
    };
    return fontMap[font || 'inter'] || 'font-sans';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading form...</div>;
  if (!form) return <div className="min-h-screen flex items-center justify-center text-red-500">Form not found.</div>;

  const theme = form.theme || {};
  const borderRadiusClass = getBorderRadius(theme.borderRadius);
  const fontClass = getFontClass(theme.fontFamily);
  const primaryColor = theme.primaryColor || '#4f46e5';
  const backgroundColor = theme.backgroundColor || '#f8fafc';
  const cardBackground = theme.cardBackground || '#ffffff';
  const textColor = theme.textColor || '#1e293b';
  const borderColor = theme.borderColor || '#e2e8f0';
  const headerStyle = theme.headerStyle || 'default';

  // View: Success / Score Screen
  if (submitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${fontClass}`} style={{ backgroundColor }}>
        <div
          className={`max-w-xl w-full p-12 ${borderRadiusClass} shadow-xl text-center space-y-6 border border-black/5 animate-scale-in hover-lift transition-all duration-300`}
          style={{ backgroundColor: cardBackground }}
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in transition-all duration-300 hover:scale-110 hover:rotate-12">
            <Check size={32} className="transition-transform duration-300" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: textColor }}>
            {form.thankYouTitle || "Submission Received"}
          </h2>
          <p className="text-lg leading-relaxed opacity-80" style={{ color: textColor }}>
            {form.thankYouDescription || "Thank you for filling out this form."}
          </p>
          <div className="pt-8">
            <div className="w-8 h-1 bg-black/10 mx-auto rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // If form is closed, show message instead of inputs
  if (form.isOpen === false) {
    return (
      <div className={`min-h-screen py-10 px-4 ${fontClass}`} style={{ backgroundColor }}>
        <div
          className={`${cardBackground} ${borderRadiusClass} shadow-lg max-w-xl mx-auto p-8 text-center`}
          style={{ backgroundColor: cardBackground, borderColor, borderWidth: '1px' }}
        >
          <h1 className="text-3xl font-bold mb-3" style={{ color: primaryColor }}>
            This form is currently not accepting responses.
          </h1>
          <p style={{ color: textColor, opacity: 0.8 }}>
            The owner of this form has closed it for new submissions. Please check back later or contact them directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 md:px-6 transition-colors duration-500 ${fontClass}`} style={{ backgroundColor }}>
      <div className="max-w-[640px] mx-auto space-y-6">
        {/* Header Card */}
        <div
          className={`${cardBackground} ${borderRadiusClass} shadow-sm border border-black/5 p-8 md:p-10 relative overflow-hidden animate-fade-in hover-lift transition-all duration-300`}
          style={{
            backgroundColor: cardBackground,
            borderTop: headerStyle === 'banner' ? `8px solid ${primaryColor}` : '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {headerStyle === 'minimal' && <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: primaryColor }} />}

          <h1
            className={`text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-tight ${headerStyle === 'centered' ? 'text-center' : ''}`}
            style={{ color: textColor }}
          >
            {form.title}
          </h1>
          {form.description && (
            <p className={`text-lg leading-relaxed opacity-70 ${headerStyle === 'centered' ? 'text-center' : ''}`} style={{ color: textColor }}>
              {form.description}
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {form.questions.map((q: any, index: number) => (
            <div
              key={q.id}
              className={`${borderRadiusClass} p-8 md:p-10 shadow-sm border border-black/5 hover:shadow-md transition-all duration-300 hover:scale-[1.01] animate-fade-in`}
              style={{ 
                backgroundColor: cardBackground,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-medium leading-snug" style={{ color: textColor }}>
                    {q.text} <span className="text-red-500 opacity-60 ml-0.5" title="Required">{q.required ? '*' : ''}</span>
                  </h3>
                </div>

                <div className="">
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {q.options.map((option: string, i: number) => (
                        <label
                          key={i}
                          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:shadow-md button-press ${answers[q.id] === option
                            ? 'border-opacity-100 bg-opacity-5 scale-[1.02]'
                            : 'border-transparent bg-black/5 hover:bg-black/10'
                            }`}
                          style={{
                            borderColor: answers[q.id] === option ? primaryColor : 'transparent',
                            backgroundColor: answers[q.id] === option ? `${primaryColor}10` : undefined
                          }}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={option}
                            checked={answers[q.id] === option}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-5 h-5 border-2 mr-4 transition-all"
                            style={{
                              accentColor: primaryColor,
                              borderColor: 'currentColor'
                            }}
                          />
                          <span className="text-lg" style={{ color: textColor }}>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <input
                      type="text"
                      className={`w-full p-4 text-lg bg-transparent border-0 border-b-2 focus:ring-0 transition-all duration-300 placeholder:text-black/20 focus:scale-[1.02] focus:translate-x-1`}
                      style={{
                        color: textColor,
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderBottomColor: answers[q.id] ? primaryColor : 'rgba(0,0,0,0.1)'
                      }}
                      placeholder="Your answer..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}

                  {q.type === 'long_text' && (
                    <textarea
                      className={`w-full p-4 text-lg bg-black/5 rounded-lg border-2 border-transparent focus:bg-transparent transition-all duration-300 placeholder:text-black/20 focus:ring-0 focus:scale-[1.01] focus:shadow-md`}
                      style={{
                        color: textColor,
                        boxShadow: 'none'
                      }}
                      placeholder="Type your answer here..."
                      rows={4}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = primaryColor}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                  )}

                  {q.type === 'date' && (
                    <input
                      type="date"
                      className="w-full p-4 text-lg bg-black/5 rounded-lg border-2 border-transparent focus:bg-transparent focus:border-opacity-100 transition-all text-zinc-900"
                      style={{ outlineColor: primaryColor }}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}

                  {q.type === 'rating' && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleAnswerChange(q.id, star)}
                          className="p-1 transition-all duration-300 hover:scale-125 focus:outline-none button-press"
                        >
                          <Star
                            size={32}
                            fill={answers[q.id] >= star ? primaryColor : 'transparent'}
                            color={answers[q.id] >= star ? primaryColor : '#d1d5db'}
                            strokeWidth={1.5}
                            className="transition-all duration-300"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-8 pb-20">
          <div className="text-sm text-zinc-400 font-medium">
            Powered by <span className="text-zinc-900 font-bold">Form X</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-10 py-4 ${borderRadiusClass} font-bold text-white shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-lg ripple`}
            style={{
              backgroundColor: primaryColor,
            }}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
