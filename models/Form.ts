import mongoose from 'mongoose';

// 1. Define how a single "Question" looks
const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Unique ID for the question
  text: { type: String, required: true }, // The question itself
  type: {
    type: String,
    enum: ['multiple_choice', 'text', 'long_text', 'date', 'rating'],
    required: true
  },
  options: [{ type: String }], // Array of choices (e.g., ["Yes", "No"])
  correctAnswer: { type: Number }, // Index of the correct answer (for Quizzes only)
  required: { type: Boolean, default: true },
  allowMultiple: { type: Boolean, default: false }
});

// 2. Define how the main "Form" looks
const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['quiz', 'survey'],
    default: 'survey'
  },
  questions: [QuestionSchema], // A list of questions (defined above)
  createdBy: { type: String, required: true }, // Clerk user ID
  theme: {
    primaryColor: { type: String, default: '#4f46e5' }, // Indigo-600
    backgroundColor: { type: String, default: '#f8fafc' }, // Slate-50
    cardBackground: { type: String, default: '#ffffff' }, // White
    textColor: { type: String, default: '#1e293b' }, // Slate-800
    borderColor: { type: String, default: '#e2e8f0' }, // Slate-200
    fontFamily: {
      type: String,
      enum: ['inter', 'roboto', 'open-sans', 'lato', 'montserrat', 'playfair', 'poppins', 'merriweather'],
      default: 'inter'
    },
    borderRadius: {
      type: String,
      enum: ['sm', 'md', 'lg', 'xl', 'full'],
      default: 'lg'
    },
    headerStyle: {
      type: String,
      enum: ['default', 'centered', 'minimal', 'banner'],
      default: 'default'
    },
    backgroundPattern: {
      type: String,
      enum: ['none', 'grid', 'polka', 'stripes', 'wavy', 'solid'],
      default: 'none'
    }
  },
  thankYouTitle: { type: String, default: 'Submission received!' },
  thankYouDescription: { type: String, default: 'Thank you for completing this form.' },
  isOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 3. Export the model so other files can use it
// The "||" check prevents errors if the model is already compiled in Next.js
export default mongoose.models.Form || mongoose.model('Form', FormSchema);
