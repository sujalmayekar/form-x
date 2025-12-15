import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Form from '@/models/Form';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    // Find the form by the ID provided in the URL
    const form = await Form.findById(params.id);

    if (!form) {
      return NextResponse.json({ success: false, error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, form }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}