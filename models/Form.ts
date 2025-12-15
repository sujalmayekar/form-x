import mongoose from 'mongoose';

// 1. Define how a single "Question" looks
const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Unique ID for the question
  text: { type: String, required: true }, // The question itself
  type: { 
    type: String, 
    enum: ['multiple_choice', 'text', 'rating'], 
    required: true 
  },
  options: [{ type: String }], // Array of choices (e.g., ["Yes", "No"])
  correctAnswer: { type: Number }, // Index of the correct answer (for Quizzes only)
  required: { type: Boolean, default: true }
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
  createdAt: { type: Date, default: Date.now }
});

// 3. Export the model so other files can use it
// The "||" check prevents errors if the model is already compiled in Next.js
export default mongoose.models.Form || mongoose.model('Form', FormSchema);
