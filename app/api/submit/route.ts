import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Response from '@/models/Response';
import Form from '@/models/Form';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { formId, answers } = await req.json();

    // Optional: Calculate score if it's a quiz
    let score = 0;
    const form = await Form.findById(formId);
    
    if (form && form.type === 'quiz') {
      // Logic to compare user answers with correct answers
      // We cast q to 'any' to avoid strict type checks on the dynamic question object
      form.questions.forEach((q: any) => {
        if (q.correctAnswer !== undefined && answers[q.id] === q.correctAnswer) {
          score++;
        }
      });
    }

    // Save the response to the database
    await Response.create({
      formId,
      answers,
      score
    });

    return NextResponse.json({ success: true, score }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
