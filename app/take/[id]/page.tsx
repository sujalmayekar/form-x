'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star } from 'lucide-react'; // Ensure lucide-react is installed

export default function TakeQuizPage() {
  const { id } = useParams(); // Get ID from URL
  const [form, setForm] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the form when the page loads
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

  // 2. Handle Answer Selection
  const handleChange = (qId: number, value: any) => {
    setAnswers({ ...answers, [qId]: value });
  };

  // 3. Submit Answers
  const handleSubmit = async () => {
    // Basic validation
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading form...</div>;
  if (!form) return <div className="min-h-screen flex items-center justify-center text-red-500">Form not found.</div>;

  // View: Success / Score Screen
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">Submission Received!</h1>
            <p className="text-slate-600 mb-6">Thank you for completing the form.</p>
            
            {score !== null && (
            <div className="bg-emerald-100 p-4 rounded-xl">
                <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">Your Score</p>
                <p className="text-4xl font-extrabold text-emerald-700 mt-2">{score}</p>
            </div>
            )}
        </div>
      </div>
    );
  }

  // View: Taking the Form
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm border-t-8 border-t-indigo-600 p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{form.title}</h1>
            <p className="text-slate-600">{form.description}</p>
          </div>

          {/* Questions */}
          {form.questions.map((q: any) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <p className="font-medium text-lg text-slate-800 mb-4">
                  {q.text} {q.required && <span className="text-red-500">*</span>}
              </p>
              
              {/* Multiple Choice Render */}
              {q.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {q.options.map((opt: string, idx: number) => (
                        <label key={idx} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-slate-50">
                        <input
                            type="radio"
                            name={`q-${q.id}`}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            onChange={() => handleChange(q.id, idx)}
                            checked={answers[q.id] === idx}
                        />
                        <span className="text-slate-700">{opt}</span>
                        </label>
                    ))}
                  </div>
              )}

              {/* Text Render */}
              {q.type === 'text' && (
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                            className={`p-1 transition-colors ${answers[q.id] >= star ? 'text-yellow-400' : 'text-slate-300'}`}
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
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
            >
                Submit Form
            </button>
          </div>
      </div>
    </div>
  );
}