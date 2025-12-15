import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Make sure this path matches your db connection file
import Form from '@/models/Form';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Create a new Form document using the data from the frontend
    const newForm = await Form.create(data);

    // We use (newForm as any) to tell TypeScript it's okay to access _id
    return NextResponse.json({ success: true, id: (newForm as any)._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}