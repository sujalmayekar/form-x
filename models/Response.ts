import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  // We use a Map to store answers flexibly (QuestionID -> Answer)
  answers: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed 
  }, 
  score: { type: Number, default: 0 }, // Only used if it's a Quiz
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Response || mongoose.model('Response', ResponseSchema);