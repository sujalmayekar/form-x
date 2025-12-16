import React from 'react';
import { 
  CheckCircle, 
  BarChart3, 
  CheckSquare, 
  PieChart
} from 'lucide-react';

interface LandingScreenProps {
  onCreate: (type: 'quiz' | 'survey') => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onCreate }) => (
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

export default LandingScreen;