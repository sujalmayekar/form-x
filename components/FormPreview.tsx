import React from 'react';
import { Settings } from 'lucide-react';

interface FormPreviewProps {
  form: any;
  onBack: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form, onBack }) => {
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

export default FormPreview;