import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  // Store answers as a flexible object (QuestionID -> Answer)
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  score: { type: Number, default: 0 }, // Only used if it's a Quiz
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Response || mongoose.model('Response', ResponseSchema);