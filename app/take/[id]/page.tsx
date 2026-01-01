'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star } from 'lucide-react';

export default function TakeQuizPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (qId: number, value: any) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = async () => {
    if(form?.questions.some((q: any) => q.required && !answers[q.id] && answers[q.id] !== 0)) {
        alert("Please answer all required questions.");
        return;
    }

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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor }}>
        <div className={`${cardBackground} p-8 ${borderRadiusClass} shadow-lg max-w-md w-full`} style={{ backgroundColor: cardBackground }}>
            <h1 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>Submission Received!</h1>
            <p className="mb-6" style={{ color: textColor }}>Thank you for completing the form.</p>
            
            {score !== null && (
            <div className={`p-4 ${borderRadiusClass}`} style={{ backgroundColor: `${primaryColor}20` }}>
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Your Score</p>
                <p className="text-4xl font-extrabold mt-2" style={{ color: primaryColor }}>{score}</p>
            </div>
            )}
        </div>
      </div>
    );
  }

  // View: Taking the Form
  return (
    <div className={`min-h-screen py-10 px-4 ${fontClass}`} style={{ backgroundColor }}>
      <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Card */}
          <div 
            className={`${cardBackground} ${borderRadiusClass} shadow-sm p-8`}
            style={{
              backgroundColor: cardBackground,
              borderTop: headerStyle === 'banner' ? `8px solid ${primaryColor}` : 'none',
            }}
          >
            <h1 
              className={`text-3xl font-bold mb-2 ${headerStyle === 'centered' ? 'text-center' : ''}`}
              style={{ color: textColor }}
            >
              {form.title}
            </h1>
            {form.description && (
              <p style={{ color: textColor, opacity: 0.7 }}>{form.description}</p>
            )}
          </div>

          {/* Questions */}
          {form.questions.map((q: any) => (
            <div 
              key={q.id} 
              className={`${cardBackground} ${borderRadiusClass} shadow-sm p-6`}
              style={{
                backgroundColor: cardBackground,
                borderColor: borderColor,
                borderWidth: '1px'
              }}
            >
              <p 
                className="font-medium text-lg mb-4"
                style={{ color: textColor }}
              >
                  {q.text} {q.required && <span className="text-red-500">*</span>}
              </p>
              
              {/* Multiple Choice Render */}
              {q.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {q.options.map((opt: string, idx: number) => (
                        <label 
                          key={idx} 
                          className="flex items-center space-x-3 cursor-pointer p-2 rounded transition"
                          style={{
                            backgroundColor: answers[q.id] === idx ? `${primaryColor}20` : 'transparent'
                          }}
                        >
                        <input
                            type="radio"
                            name={`q-${q.id}`}
                            className="w-5 h-5 border-gray-300"
                            style={{ 
                              accentColor: primaryColor
                            }}
                            onChange={() => handleChange(q.id, idx)}
                            checked={answers[q.id] === idx}
                        />
                        <span style={{ color: textColor }}>{opt}</span>
                        </label>
                    ))}
                  </div>
              )}

              {/* Text Render */}
              {q.type === 'text' && (
                <input
                  type="text"
                  className={`w-full ${borderRadiusClass} p-3 border focus:ring-2`}
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    backgroundColor: cardBackground,
                    '--tw-ring-color': primaryColor
                  } as React.CSSProperties}
                  placeholder="Your answer..."
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  value={answers[q.id] || ''}
                />
              )}

              {/* Rating Render */}
              {q.type === 'rating' && (
                 <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star}
                            onClick={() => handleChange(q.id, star)}
                            className="p-1 transition-colors"
                            style={{
                              color: answers[q.id] >= star ? primaryColor : borderColor
                            }}
                        >
                            <Star fill="currentColor" size={32} />
                        </button>
                    ))}
                 </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
                onClick={handleSubmit}
                className={`px-8 py-3 ${borderRadiusClass} font-bold text-white shadow-lg transition-all transform hover:-translate-y-1`}
                style={{
                  backgroundColor: primaryColor,
                }}
            >
                Submit Form
            </button>
          </div>
      </div>
    </div>
  );
}
