import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Make sure this path matches your db connection file
import Form from '@/models/Form';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Create a new Form document using the data from the frontend
    const newForm = await Form.create(data);

    // Casting to object with _id to avoid explicit any. Double cast needed if TS infers array.
    return NextResponse.json({ success: true, id: (newForm as unknown as { _id: string })._id }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}