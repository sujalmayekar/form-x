import React from 'react';
import { Eye, ArrowLeft, Star } from 'lucide-react';
import { Form } from '@/lib/types';

interface FormPreviewProps {
  form: Form;
  onBack: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
           <Eye size={18} className="text-primary" />
           <span className="text-sm font-medium">Preview Mode</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit Preview</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-12 px-6 space-y-6">
        {/* Title Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 border-t-[6px] border-t-primary animate-fade-in relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 text-balance">
            {form.title || 'Untitled Form'}
          </h1>
          {form.description && (
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{form.description}</p>
          )}
        </div>

        {/* Questions */}
        {form.questions.map((q: any, index: number) => (
          <div key={q.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="mb-6">
               <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                 {q.text || <span className="text-slate-400 italic">Untitled Question</span>}
                 {q.required && <span className="text-red-500 ml-1">*</span>}
               </h3>
            </div>
            
            {q.type === 'multiple_choice' && (
              <div className="space-y-3">
                {q.options.map((opt: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                       {/* Radio circle */}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {q.type === 'text' && (
              <div className="border-b border-slate-200 dark:border-slate-700 py-2 w-full text-slate-400 text-sm">
                 Your answer
              </div>
            )}

            {q.type === 'rating' && (
              <div className="flex items-center gap-2">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} size={32} className="text-slate-200 dark:text-slate-700" />
                 ))}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex justify-between items-center pt-8 px-2">
           <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all opacity-50 cursor-not-allowed">
             Submit
           </button>
           <div className="text-xs text-slate-400">
             Clear form
           </div>
        </div>

      </div>
       
       {/* Footer Branding */}
       <div className="flex justify-center mt-12 mb-8">
          <div className="text-slate-400 text-xs font-medium">
             Powered by <span className="text-slate-600 dark:text-slate-300 font-bold">Form X</span>
          </div>
       </div>

    </div>
  );
};

export default FormPreview;